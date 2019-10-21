<template>
  <div id="template-properties-list">
    <v-card
      flat
      v-if="this.template"
    >
      <v-card-text>
        <ListTabView
          :headers="propertyHeaders"
          :objects="listTabViewFormattedData"
          mode="list"
          :isLoading="isLoading"
        >
          <template v-slot:listTopContent>
            <v-card flat>
              <v-card-text>
                <v-btn
                  color="#55cec7"
                  raised
                  dark
                  @click="showDialog = true"
                >Create Property</v-btn>
              </v-card-text>
            </v-card>
          </template>

          <template v-slot:listUtils="{ object }">
            <v-btn
              icon
              @click="deleteProperty(object.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <template v-slot:listItem.name.editable="{ object }">
            <v-edit-dialog
              @close="propertyEditted(object)"
            > {{ object.name }}
              <template v-slot:input>
                <v-text-field
                  v-model="object.name"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:listItem.fieldType.editable="{ object }">
            <v-edit-dialog
              style="padding-top: 12px;"
            > {{ object.fieldType }}
              <template v-slot:input>
                <v-select
                  v-model="object.fieldType"
                  :items="propertyFieldTypes"
                  item-text="text"
                  item-value="value"
                  filled
                  label="Field Type"
                  single-line
                  background-color="#f7f9fc"
                  color="green darken-1"
                  @change="propertyEditted(object)"
                ></v-select>
              </template>
            </v-edit-dialog>
          </template>
        </ListTabView>

        <create-template-property-dialog
          :showDialog="showDialog"
          :templateId="template.id"
          :fieldTypes="propertyFieldTypes"
          @propertyAdded="propertyAdded"
          @dialogToggled="dialogToggled"
        ></create-template-property-dialog>

      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import CreateTemplatePropertyDialog from './CreateTemplatePropertyDialog';

  export default {
    name: 'template-properties-list',
    props: {
      template: Object
    },
    components: {
      ListTabView,
      CreateTemplatePropertyDialog
    },
    computed: {
      templateProperties () {
        return this.template.properties;
      },
      listTabViewFormattedData: {
        get () {
          var objects = [];
          this.templateProperties.forEach(function (property) {
            var listData = {
              name: property.name,
              fieldType: property.fieldType,
              id: property.id
            }
            objects.push({
              id: property.id,
              route: null,
              tabsData: {},
              listData: listData
            });
          })
          return objects;
        }
      }
    },
    methods: {
      dialogToggled (newValue) {
        this.showDialog = newValue
      },
      propertyAdded (property) {
        this.$emit('propertyAdded', property);
      },
      deleteProperty (propertyId) {
        var property = this.templateProperties.filter(item => item.id == propertyId)[0];
        console.log("DELETE", propertyId, property)
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        apiUrl += '/properties/'+property.id;
        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.template.properties.splice(this.template.properties.indexOf(property), 1);
          }
        })
      },
      propertyEditted (changedProperty) {
        var property = this.template.properties.filter(item => item.id == changedProperty.id)[0]
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        apiUrl += '/properties/'+property.id;
        var formdata = {
          name: changedProperty.name,
          fieldType: changedProperty.fieldType
        };
        this.$http.put(apiUrl, formdata).then(response => {
          if (response.status == 200) {
            this.template.properties[this.template.properties.indexOf(property)] = response.body;
          }
        })
      }
    },
    data () {
      return {
        showDialog: false,
        propertyHeaders: [
          { text: 'Name', value: 'name', editable: true },
          { text: 'Field Type', value: 'fieldType', editable: true },
          { text: 'Utils', value: 'utils', editable: false }
        ],
        propertyFieldTypes: [
          { text: "String", value: "string" },
          { text: "Number", value: "number" }
        ],
        isLoading: false
      }
    }
  }  
</script>

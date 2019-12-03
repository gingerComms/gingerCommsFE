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
          :isDraggable="true"
          @orderChanged="orderChanged"
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
              @click="showSelectEditDialog(object)"
              v-if="object.fieldType == 'select'"
            >
              <v-icon>mdi-pen</v-icon>
            </v-btn>

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
          :templateProperties="template.properties"
          @propertyAdded="propertyAdded"
          @dialogToggled="dialogToggled"
        ></create-template-property-dialog>

      </v-card-text>
    </v-card>

    <template-property-edit-dialog
      :showDialog="propertyEditDialogOpen"
      :property="propertyBeingEditted"
      v-if="propertyBeingEditted != null"
      @propertyEditDialogClosed="propertyBeingEditted = null; propertyEditDialogOpen = false;"
      @propertyOptionsChanged="propertyOptionsChanged"
    ></template-property-edit-dialog>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import CreateTemplatePropertyDialog from './CreateTemplatePropertyDialog';
  import TemplatePropertyEditDialog from './TemplatePropertyEditDialog';

  export default {
    name: 'template-properties-list',
    props: {
      template: Object
    },
    components: {
      ListTabView,
      CreateTemplatePropertyDialog,
      TemplatePropertyEditDialog
    },
    computed: {
      templateProperties () {
        var props = this.template.properties;
        props.sort(function (a, b) {
          return a.index - b.index
        })
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
        console.log('Added', property)
        this.$emit('propertyAdded', property);
      },
      deleteProperty (propertyId) {
        var property = this.templateProperties.filter(item => item.id == propertyId)[0];
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        apiUrl += '/properties/'+property.id;
        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.$emit('propertyRemoved', property);
          }
        })
      },
      propertyEditted (item) {
        var property = this.template.properties.filter(prop => prop.id == item.id)[0]
        var formdata = {
          id: property.id,
          name: item.name,
          // Changed so that the prop value is the prop id
          // value: this.valuefyProperty(item.name),
          fieldType: item.fieldType,
          propertyOptions: property.propertyOptions
        };
        if (typeof(formdata.propertyOptions) != 'string') {
          formdata.propertyOptions = JSON.stringify(formdata.propertyOptions);
        }

        this.$emit("propertyChanged", { property: formdata, updateKeys: true });
      },
      showSelectEditDialog (item) {
        // Shows the select edit dialog for the given property with the fieldType `Select`
        var property = this.template.properties.filter(prop => prop.id == item.id)[0];
        this.propertyBeingEditted = this.clone(property);
        this.propertyEditDialogOpen = true;
      },
      propertyOptionsChanged (property) {
        this.$emit("propertyChanged", { property });
        this.propertyEditDialogOpen = false;
        this.propertyBeingEditted = null;
      },
      orderChanged (properties) {
        console.log('Order Changed', {properties});
        var formdata = {
            properties: properties
        }
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        apiUrl += '/properties_index'
        this.$http.put(apiUrl, formdata).then(response => {
          if (response.status == 200) {
            this.$emit('propertiesOrderChanged', response.body);
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
          { text: "Number", value: "number" },
          { text: "Select", value: "select" },
          { text: "Date", value: "date" }
        ],
        isLoading: false,
        propertyEditDialogOpen: false,
        propertyBeingEditted: null
      }
    }
  }  
</script>

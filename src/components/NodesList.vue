<template>
  <div id="nodes-list">
    <v-card
      flat
    >
      <v-card-text>
        <ListTabView
          :headers="topicHeaders"
          :objects="listTabViewFormattedData"
          mode="list"
          :isLoading="isLoading"
        >
          <template v-slot:appendedRow>
            <tr id="create-node-row">
              <td>
                <v-text-field
                  dense
                  v-model="newNodeData.title"
                  v-if="createOpen"
                ></v-text-field>
              </td>
              <td v-for="prop in editableTemplateProperties()" v-bind:key="prop.value">
                <span v-if="createOpen">
                  <v-text-field
                    dense
                    v-model="newNodeData.templateData[prop.value]"
                    v-if="prop.fieldType == 'string'"
                  ></v-text-field>
                  <v-text-field
                    dense
                    v-model="newNodeData.templateData[prop.value]"
                    v-if="prop.fieldType == 'number'"
                    type="number"
                  ></v-text-field>
                  <v-select
                    v-if="prop.fieldType == 'select'"
                    v-model="newNodeData.templateData[prop.value]"
                    :items="getPropertyOptions(prop.value).options"
                    filled
                    :label="prop.text"
                    single-line
                    background-color="#f7f9fc"
                    color="green darken-1"
                  ></v-select>
                  <v-menu
                    v-if="prop.fieldType == 'date'"
                    v-model="openMenus[prop.value]"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="newNodeData.templateData[prop.value]"
                        :label="prop.text"
                        prepend-icon="event"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="newNodeData.templateData[prop.value]" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="openMenus[prop.value] = false"
                      >OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </span>
              </td>
              <td>
                <v-btn
                  color="green"
                  outlined
                  dark
                  icon
                  small
                  elevation="0"
                  v-if="createOpen"
                  @click="createNode"
                  :disabled="!newNodeFormValid"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>

                <v-btn
                  color="#55cec7"
                  outlined
                  dark
                  icon
                  small
                  elevation="0"
                  @click="createOpen = !createOpen"
                >
                  <v-icon v-if="!createOpen">mdi-plus</v-icon>
                  <v-icon v-if="createOpen">mdi-close</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>

          <template v-slot:listItem.title.editable="{ object }">
            <v-edit-dialog
              @close="nodeEditted(object)"
            > {{ object.title }}
              <template v-slot:input>
                <v-text-field
                  v-model="object.title"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template v-for="property in editableTemplateProperties()" v-slot:[propertySlotName(property.value)]="{ object }">
            <v-edit-dialog
              v-bind:key="property.value"
              @close="nodeEditted(object)"
            > {{ object[property.value] }}
              <template v-slot:input>
                <v-text-field
                  v-model="object[property.value]"
                  label="Edit"
                  single-line
                  v-if="fieldTypeFromPropertyValue(property.value) == 'string'"
                ></v-text-field>
                <v-text-field
                  v-model="object[property.value]"
                  label="Edit"
                  single-line
                  v-if="fieldTypeFromPropertyValue(property.value) == 'number'"
                  type="number"
                ></v-text-field>
                <v-select
                  v-if="fieldTypeFromPropertyValue(property.value) == 'select'"
                  v-model="object[property.value]"
                  :items="getPropertyOptions(property.value).options"
                  filled
                  :label="property.text"
                  single-line
                  background-color="#f7f9fc"
                  color="green darken-1"
                  @change="nodeEditted(object)"
                ></v-select>
                <v-menu
                  v-if="fieldTypeFromPropertyValue(property.value) == 'date'"
                  v-model="openMenus[object.id+'Date']"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="object[property.value]"
                      :label="property.text"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="object[property.value]" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="openMenus[object.id+'Date'] = false"
                    >OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:listUtils="{ object }">
            <v-btn
              icon
              @click="deleteNode(object.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </ListTabView>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';

  export default {
    name: 'nodes-list',
    props: {
      template: Object
    },
    components: {
      ListTabView
    },
    computed: {
      topicHeaders () {
        // Headers for the topics table
        var headers = [ { text: 'Title', value: 'title', editable: true } ];
        var that = this;
        this.template.properties.forEach(function (property) {
          headers.push({ text: property.name, value: that.valuefyProperty(property.name), editable: true });
        })
        headers.push({ text: 'Utils', value: 'utils', editable: false })
        return headers;
      },
      listTabViewFormattedData: {
        get () {
          var objects = [];
          var that = this;
          this.nodes.forEach(function (node) {
            var route = null;
            var listData = {
              id: node.id,
              title: node.title
            }
            var nodeProperties = node.templateData;
            that.topicHeaders.forEach(function (header) {
              if (header.value != 'title') {
                listData[header.value] = nodeProperties[header.value];
              }
            })
            objects.push({
              id: node.id,
              route: route,
              tabsData: {},
              listData: listData
            })
          })
          return objects;
        }
      },
      newNodeFormValid () {
        var valid = this.newNodeData.title != '';
        var that = this;
        this.editableTemplateProperties().forEach(function (prop) {
          if (prop.fieldType == 'string') {
            if (that.newNodeData.templateData[prop.value] == '' ||
                that.newNodeData.templateData[prop.value] == undefined) {
              valid = false;
            }
          } else if (prop.fieldType == 'number') {
            if (that.newNodeData.templateData[prop.value] == '' ||
                that.newNodeData.templateData[prop.value] == null ||
                that.newNodeData.templateData[prop.value] == undefined) {
              valid = false;
            }
          }
        })
        return valid;
      },
      apiUrl () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        apiUrl += '/nodes/';
        return apiUrl;
      }
    },
    methods: {
      cleanNode (node) {
        // Applies any validation/cleanup that may be required after a
        // property modification
        if (typeof(node.templateData) == 'string') {
          node.templateData = JSON.parse(node.templateData);
        }

        var that = this;
        var dateRegex = /\d\d\d\d-\d\d-\d\d/;

        Object.keys(node.templateData).forEach(function (prop) {
          if (that.fieldTypeFromPropertyValue(prop) == 'date' &&
              !dateRegex.test(node.templateData[prop])) {
            node.templateData[prop] = '';
          }
        })

        return node;
      },
      getNodes () {
        var that = this;
        this.$http.get(this.apiUrl).then(response => {
          if (response.status == 200) {
            var nodes = response.body;
            nodes.forEach(function (node) {
              node = that.cleanNode(node);
              that.nodes.push(node)
            })
          }
        })
      },
      createNode () {
        this.newNodeData.templateData = JSON.stringify(this.newNodeData.templateData);
        var that = this;
        this.$http.post(this.apiUrl, this.newNodeData).then(response => {
          if (response.status == 201) {
            that.newNodeData = {
              title: '',
              templateData: {}
            };
            var node = response.body;
            if (typeof(node.templateData) == 'string') {
              node.templateData = JSON.parse(node.templateData);
            }
            that.nodes.push(node);
            that.createOpen = false;
          }
        // eslint-disable-next-line
        }, response => {
          that.newNodeData = {
            title: '',
            templateData: {}
          };
        })
      },
      deleteNode (nodeID) {
        var node = this.nodes.filter(node => node.id == nodeID)[0];
        var apiUrl = process.env.VUE_APP_API_URL + '/coreVertex/'+node.id;

        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.nodes.splice(this.nodes.indexOf(node), 1);
          }
        })
      },
      nodeEditted (object) {
        var formdata = { title: object.title, templateData: {} };
        this.editableTemplateProperties().forEach(function (prop) {
          formdata.templateData[prop.value] = object[prop.value];
        })
        formdata.templateData = JSON.stringify(formdata.templateData);

        var apiUrl = process.env.VUE_APP_API_URL + '/coreVertex/'+object.id;
        this.$http.put(apiUrl, formdata).then(function (response) {
          if (response.status == 200) {
            var node = this.nodes.filter(node => node.id == object.id);
            this.nodes[this.nodes.indexOf(node)] = response.body;
          }
        })
      },
      propertySlotName (value) {
        return 'listItem.'+value+'.editable'
      },
      fieldTypeFromPropertyValue (value) {
        var prop = this.editableTemplateProperties().filter(prop => prop.value == value);
        if (prop.length == 0) {
          return undefined;
        } else {
          return prop[0].fieldType;
        } 
      },
      getPropertyOptions (value) {
        var prop = this.editableTemplateProperties().filter(prop => prop.value == value);
        if (prop.length == 0) {
          return undefined;
        } else {
          return prop[0].propertyOptions;
        } 
      },
      editableTemplateProperties () {
        // List of template properties that are all modifiable
        var props = [];
        this.template.properties.forEach(function (property) {
          props.push({
            text: property.name,
            value: property.value,
            fieldType: property.fieldType,
            propertyOptions: property.propertyOptions
          });
        })
        return props;
      },
    },
    data () {
      return {
        nodes: [],
        newNodeData: {
          title: '',
          templateData: {}
        },
        isLoading: false,
        createOpen: false,
        openMenus: {}  // Used to keep track of menus that are open 
      }
    },
    created () {
      this.getNodes();
    }
  }
</script>

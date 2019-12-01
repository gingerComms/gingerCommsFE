<template>
  <div id="nodes-list" v-if="template && template.properties">
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
              <td v-for="prop in editableTemplateProperties()" v-bind:key="prop.id">
                <span v-if="createOpen">
                  <template-property-input
                    :fieldType="prop.fieldType"
                    v-model="newNodeData.templateData[prop.id]"
                    :label="prop.text"
                    :propertyOptions="getPropertyOptions(prop.id)"
                  ></template-property-input>
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
              @close="nodeEditted(object, 'string')"
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
          <template v-for="property in editableTemplateProperties()" v-slot:[propertySlotName(property.id)]="{ object }">
            <v-edit-dialog
              v-bind:key="property.id"
              @close="nodeEditted(object, property.fieldType)"
            > {{ object[property.id] }}
              <template v-slot:input>
                <template-property-input
                  :fieldType="fieldTypeFromPropertyId(property.id)"
                  v-model="object[property.id]"
                  :label="property.text"
                  :propertyOptions="getPropertyOptions(property.id)"
                ></template-property-input>
              </template>
            </v-edit-dialog>
          </template>

          <template v-slot:listUtils="{ object }">
            <v-btn
              icon
              :to="'/teams/'+$route.params.teamId+'/'+object.id"
            >
              <v-icon>mdi-pen</v-icon>
            </v-btn>
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
  import TemplatePropertyInput from './TemplatePropertyInput';

  export default {
    name: 'nodes-list',
    props: {
      template: Object,
      parentType: String,
      parentId: String
    },
    components: {
      ListTabView,
      TemplatePropertyInput
    },
    computed: {
      topicHeaders () {
        // Headers for the topics table
        var headers = [ { text: 'Title', value: 'title', editable: true } ];
        this.template.properties.forEach(function (property) {
          headers.push({ text: property.name, value: property.id, editable: true });
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
              title: node.title,
              content: node.content
            }
            var nodeProperties = node.templateData;
            that.editableTemplateProperties().forEach(function (prop) {
              if (prop.name != 'Title') {
                if (prop.fieldType != 'select') {
                  listData[prop.id] = nodeProperties[prop.id];
                } else {
                  listData[prop.id] = (nodeProperties[prop.id]) ? nodeProperties[prop.id].value : '';
                }
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
            if (that.newNodeData.templateData[prop.id] == '' ||
                that.newNodeData.templateData[prop.id] == undefined) {
              valid = false;
            }
          } else if (prop.fieldType == 'number') {
            if (that.newNodeData.templateData[prop.id] == '' ||
                that.newNodeData.templateData[prop.id] == null ||
                that.newNodeData.templateData[prop.id] == undefined) {
              valid = false;
            }
          }
        })
        return valid;
      },
      apiUrl () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/'+this.parentType+'/'+this.parentId+'/templates/'+this.template.id;
        apiUrl += '/nodes';
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

        Object.keys(node.templateData).forEach(function (propId) {
          if (that.fieldTypeFromPropertyId(propId) == 'date' &&
              !dateRegex.test(node.templateData[propId])) {
            node.templateData[propId] = '';
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
        var templateData = {};
        var that = this;
        this.editableTemplateProperties().forEach(function (prop) {
          if (prop.fieldType != 'select') {
            templateData[prop.id] = that.newNodeData.templateData[prop.id]
          } else {
            templateData[prop.id] = { value: that.newNodeData.templateData[prop.id], index: -1 }
          }
        })

        this.newNodeData.templateData = JSON.stringify(templateData);
        this.$http.post(this.apiUrl, this.newNodeData).then(response => {
          if (response.status == 201) {
            that.newNodeData = {
              title: '',
              templateData: {},
              content: ''
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
        console.log(object)
        var formdata = { title: object.title, templateData: {}, content: object.content };
        this.editableTemplateProperties().forEach(function (prop) {
          if (prop.fieldType != 'select') {
            formdata.templateData[prop.id] = object[prop.id];
          } else {
            formdata.templateData[prop.id] = { value: object[prop.id], index: -1 }
          }
        })
        formdata.templateData = JSON.stringify(formdata.templateData);

        var apiUrl = process.env.VUE_APP_API_URL + '/coreVertex/'+object.id;
        this.$http.put(apiUrl, formdata).then(function (response) {
          if (response.status == 200) {
            var node = this.nodes.filter(node => node.id == object.id);
            this.nodes[this.nodes.indexOf(node)] = response.body;
            this.$emit('nodeUpdated')
          }
        })
      },
      propertySlotName (id) {
        return 'listItem.'+id+'.editable'
      },
      fieldTypeFromPropertyId (id) {
        var prop = this.editableTemplateProperties().filter(prop => prop.id == id);
        if (prop.length == 0) {
          return undefined;
        } else {
          return prop[0].fieldType;
        } 
      },
      getPropertyOptions (id) {
        var prop = this.editableTemplateProperties().filter(prop => prop.id == id);
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
            fieldType: property.fieldType,
            propertyOptions: property.propertyOptions,
            id: property.id
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
          templateData: {},
          content: ''
        },
        isLoading: false,
        createOpen: false,
        openMenus: {}  // Used to keep track of menus that are open 
      }
    },
    created () {
      if (this.template) {
        this.getNodes();
      }
    },
    watch: {
      template () {
        this.getNodes();
      }
    }
  }
</script>

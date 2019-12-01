<template>
  <v-card
    id="nodes-scrumboard"
  >
    <v-card-text>
      <v-select
        v-model="selectedProperty"
        :items="selectFields"
        label="Scrum Property"
        color="green darken-1"
        filled
        dense
        rounded
        background-color="#f7f9fc"
      ></v-select>

      <kanban-board
        v-if="selectedProperty"
        :stages="scrumStages"
        :blocks="scrumBlocks"
        @update-block="updateBlock"
      >
        <div v-for="stage in scrumStages" :slot="stage" :key="stage">
          <h2>{{ stage }}</h2>
        </div>

        <div v-for="block in scrumBlocks" :slot="block.id" :key="block.id">
          <div>
            {{ block.title }}
          </div>
        </div>
      </kanban-board>
    </v-card-text>
  </v-card>
</template>

<script>
  require("../styles/kanban.scss");

  export default {
    name: 'nodes-scrumboard',
    components: {
    },
    props: {
      template: Object,
      parentType: String,
      parentId: String
    },
    computed: {
      apiUrl () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/'+this.parentType+'/'+this.parentId+'/templates/'+this.template.id;
        apiUrl += '/nodes';
        return apiUrl;
      },
      selectFields () {
        var fields = [];
        this.template.properties.forEach(function (i) {
          if (i.fieldType == 'select') {
            fields.push({
              text: i.name,
              value: i.id
            });
          }
        })
        return fields;
      },
      scrumStages () {
        if (this.selectedProperty) {
          var prop = this.template.properties.filter(prop => prop.id == this.selectedProperty)[0];
          if (prop.propertyOptions.options != undefined) {
            return prop.propertyOptions.options;
          }
        }
        return []
      },
      scrumBlocks () {
        var blocks = [];
        var that = this;
        this.nodes.forEach(function (node) {
          blocks.push({
            id: node.id,
            title: node.title,
            status: (node.templateData[that.selectedProperty]) ? node.templateData[that.selectedProperty].value : '',
            index: (node.templateData[that.selectedProperty]) ? node.templateData[that.selectedProperty].index : -1,
          });
        })
        blocks.sort(function (a, b) {
          return a.index - b.index
        })
        return blocks;
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
      fieldTypeFromPropertyId (id) {
        var prop = this.editableTemplateProperties().filter(prop => prop.id == id);
        if (prop.length == 0) {
          return undefined;
        } else {
          return prop[0].fieldType;
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
      propertyOptionsChanged () {
        // TODO
        console.log(this.selectedProperty);
      },
      updateBlock (id, status) {
        var node = this.nodes.filter(i => i.id == id)[0];
        var formdata = { title: node.title, templateData: {}, content: node.content };
        this.editableTemplateProperties().forEach(function (prop) {
          formdata.templateData[prop.id] = node[prop.id];
        })

        var index = this.scrumBlocks.indexOf(this.scrumBlocks.filter(block => block.id == id)[0])
        formdata.templateData[this.selectedProperty] = { value: status, index: index };
        formdata.templateData = JSON.stringify(formdata.templateData);

        var apiUrl = process.env.VUE_APP_API_URL + '/coreVertex/'+node.id;
        this.$http.put(apiUrl, formdata).then(function (response) {
          if (response.status == 200) {
            this.nodes[this.nodes.indexOf(node)] = response.body;
            this.$emit('nodeUpdated')
          }
        })
      }
    },
    data () {
      return {
        nodes: [],
        selectedProperty: null
      }
    },
    created () {
      this.getNodes();
    }
  }
</script>

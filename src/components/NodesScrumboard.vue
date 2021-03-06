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
        @change="setBlocks(); setStages();"
      ></v-select>

      <div class="drag-container">
        <draggable
          group="stages"
          :list="scrumStages"
          @end="stagesOrderChanged(scrumStages)"
          class="drag-list"
          >
          <li v-for="stage in scrumStages" class="drag-column" :class="{['drag-column-' + stage]: true}" :key="stage.name">
            <span class="drag-column-header">
              <h2>{{ stage.name }}</h2>
            </span>
            <div class="drag-options"></div>
            <draggable
              group="blocks"
              :list="stage.blocks"
              @add="blocksOrderChanged($event, stage)"
              class="drag-inner-list"
            >
              <li class="drag-item" v-for="block in stage.blocks" :data-block-id="block.id" :key="block.id">
                <strong>{{ block.title }}</strong>
              </li>
            </draggable>
          </li>
        </draggable>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import draggable from 'vuedraggable'

  require("../styles/kanban.scss");

  export default {
    name: 'nodes-scrumboard',
    components: {
      draggable
    },
    props: {
      template: Object,
      parentType: String,
      parentId: String,
      nodes: Array
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
    },
    methods: {
      setStages () {
        var that = this;
        if (this.selectedProperty) {
          var prop = this.template.properties.filter(prop => prop.id == this.selectedProperty)[0];
          if (prop.propertyOptions.options != undefined) {
            var stages = [];
            prop.propertyOptions.options.forEach(function (opt) {
              stages.push({
                name: opt,
                blocks: that.scrumBlocks.filter(block => block.status == opt)
              });
            })
            that.scrumStages = stages;
          }
        }
      },
      setBlocks () {
        var blocks = [];
        var that = this;
        console.log('Setting Blocks')
        this.nodes.forEach(function (node) {
          var block = {
            id: node.id,
            title: node.title,
            status: (node.templateData[that.selectedProperty]) ? node.templateData[that.selectedProperty].value : '',
            index: (node.templateData[that.selectedProperty]) ? node.templateData[that.selectedProperty].index : -1,
            templateData: node.templateData,
          };
          blocks.push(block);
        })
        blocks.sort(function (a, b) {
          return a.index - b.index;
        })
        this.scrumBlocks = blocks;
      },
      stagesOrderChanged (stages) {
        console.log('Stages order changed', this.selectedProperty, this.template.properties)
        var property = this.template.properties.filter(prop => prop.id == this.selectedProperty)[0]

        var formdata = {
          id: property.id,
          name: property.name,
          fieldType: property.fieldType,
          propertyOptions: { options: stages.map(stage => stage.name) }
        };
        if (typeof(formdata.propertyOptions) == 'string') {
          formdata.propertyOptions = JSON.stringify(formdata.propertyOptions);
        }

        var that = this;
        this.$emit("propertyChanged", { property: formdata, updateKeys: false, callback () {
          that.setBlocks();
          that.setStages();
        }});
      },
      blocksOrderChanged (e, newStage) {
        var formdata = { nodes: [] };

        var that = this;
        newStage.blocks.forEach(function (i) {
          i.templateData[that.selectedProperty].value = newStage.name;
          i.templateData[that.selectedProperty].index = newStage.blocks.indexOf(i)
          formdata.nodes.push({
            id: i.id,
            title: i.title,
            index: i.templateData[that.selectedProperty].index,
            templateData: JSON.stringify(i.templateData)
          })

          var node = that.nodes.filter(node => node.id == i.id)[0];
          that.nodes[that.nodes.indexOf(node)].templateData[that.selectedProperty].index = i.templateData[that.selectedProperty].index;
          that.nodes[that.nodes.indexOf(node)].templateData[that.selectedProperty].value = newStage.name;
        })
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+this.parentId+'/templates/'+this.template.id+'/nodes_index';
        this.$http.put(apiUrl, formdata).then(function (response) {
          if (response.status == 200) {
            that.$emit('nodeUpdated');
            that.setBlocks();
            that.setStages();
          }
        })
      }
    },
    data () {
      return {
        selectedProperty: null,
        scrumStages: [],
        scrumBlocks: []
      }
    }
  }
</script>

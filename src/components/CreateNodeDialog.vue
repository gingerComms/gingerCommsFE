<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="create-node-dialog"
  >
    <v-card>
      <v-card-title class="headline">
        Create Topic
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="formdata.title"
          filled
          label="Title"
        ></v-text-field>

        <v-select
          v-model="selectedTemplate"
          :items="templateSelectOptions"
          filled
          label="Template"
          @change="formdata.templateData = {}"
        ></v-select>

        <div v-if="selectedTemplate != null">
          <template-property-input
            v-for="property in targetedTemplate.properties"
            v-bind:key="property.id"
            :fieldType="property.fieldType"
            v-model="formdata.templateData[property.id]"
            :label="property.name"
            :propertyOptions="property.propertyOptions"
          ></template-property-input>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="green darken-1"
          text
          v-on:click="dialogOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          v-on:click="createNode"
          :disabled="!selectedTemplate || !formdata.title"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import TemplatePropertyInput from './TemplatePropertyInput';

  export default {
    name: 'create-node-dialog',
    props: {
      parentNodeId: String,
      parentNodeType: String,
      showDialog: Boolean
    },
    components: {
      TemplatePropertyInput
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set (newValue) {
          this.$emit('dialogToggled', newValue);
        }
      },
      templateSelectOptions () {
        var options = [];
        this.templates.forEach(function (template) {
          options.push({ text: template.name, value: template.id })
        })
        return options;
      },
      targetedTemplate () {
        if (this.selectedTemplate == null) {
          return null;
        }
        var template = this.templates.filter(item => item.id == this.selectedTemplate)[0]
        return template
      }
    },
    methods: {
      createNode () {
        var templateData = {};
        var that = this;
        this.targetedTemplate.properties.forEach(function (prop) {
          if (prop.fieldType != 'select') {
            templateData[prop.id] = that.formdata.templateData[prop.id]
          } else {
            templateData[prop.id] = { value: that.formdata.templateData[prop.id], index: 0 }
          }
        })

        this.formdata.templateData = JSON.stringify(templateData);
        var apiUrl = process.env.VUE_APP_API_URL + '/'+this.parentNodeType+'/'+this.parentNodeId;
        apiUrl += '/templates/'+this.selectedTemplate+'/nodes';
        
        this.$http.post(apiUrl, this.formdata).then(response => {
          if (response.status == 201) {
            var template = response.body.template;
            console.log(template)
            var createdNode = {
              id: response.body.id,
              children: [],
              template: template,
              templateData: response.body.templateData,
              title: response.body.title
            }
            this.$emit('nodeCreated', createdNode, that.parentNodeId);
            this.formdata = { title: '', templateData: {}, content: '' };
            this.dialogOpen = false;
          }
        })
      },
      getTemplates () {
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+this.$route.params.teamId+'/templates';
        this.$http.get(apiUrl).then(response => {
          if (response.status == 200) {
            var templates = response.body;
            templates.forEach(function (temp) {
              temp.properties.forEach(function (prop) {
                if (typeof(prop.propertyOptions) == 'string') {
                  prop.propertyOptions = JSON.parse(prop.propertyOptions);
                }
              })
            })
            this.templates = templates;
          }
        })
      }
    },
    data () {
      return {
        formdata: { title: '', templateData: {}, content: '' },
        selectedTemplate: null,
        templates: []
      }
    },
    created () {
      this.getTemplates();
    }
  }
</script>

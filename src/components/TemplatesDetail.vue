<template>
  <div id="templates-detail" class="template-content">
    <v-card
      flat
      id="base-card"
      v-if="this.template">
      <v-btn
          color="#55cec7"
          dark
          fab
          small
          absolute
          id="back-btn"
          elevation="0"
          @click="$router.back()"
        >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-card-title class="headline">
        {{ template.name }}
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="#55cec7"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#details">
            Details
            <v-icon>mdi-pen</v-icon>
          </v-tab>
          <v-tab href="#properties">
            Properties
            <v-icon>mdi-playlist-edit</v-icon>
          </v-tab>
          <v-tab href="#nodes">
            Topics
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item value="details">
              <template-edit
                :template="template"
                @templateEditted="templateEditted"
              ></template-edit>
            </v-tab-item>

            <v-tab-item value="properties">
              <template-properties-list
                :template="template"
                @propertyAdded="propertyAdded"
                @propertyRemoved="propertyRemoved"
                @propertyChanged="propertyChanged"
              ></template-properties-list>
            </v-tab-item>

            <v-tab-item value="nodes">
              <nodes-list
                :template="template"
                :key="nodesKey"
              ></nodes-list>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import TemplateEdit from './TemplateEdit';
  import TemplatePropertiesList from './TemplatePropertiesList';
  import NodesList from './NodesList';
  require("../styles/templates-detail.scss");

  export default {
    name: 'templates-detail',
    props: [],
    components: {
      TemplateEdit,
      TemplatePropertiesList,
      NodesList
    },
    methods: {
      getTemplate () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/' + this.$route.params.teamId + '/templates/' + this.$route.params.templateId;
        this.$http.get(apiUrl).then(response => {
          if (response.status == 200) {
            var template = response.body;
            template.properties.forEach(function (prop) {
              if (typeof(prop.propertyOptions) == 'string') {
                prop.propertyOptions = JSON.parse(prop.propertyOptions)
              }
            })
            this.template = template;
          }
        })
      },
      templateEditted (template) {
        this.template.name = template.name;
      },
      propertyAdded (property) {
        this.template.properties.push(property);
      },
      propertyRemoved (property) {
        this.template.properties.splice(this.template.properties.indexOf(property), 1);
      },
      propertyChanged (property, newValue) {
        property = this.template.properties.filter(prop => prop.id == property.id)[0];
        var propertyId = this.template.properties.indexOf(property);
        // Confirm that the newValue has the JSON parsed, and parse it if it doesn't
        if (typeof(newValue.propertyOptions) == 'string') {
          newValue.propertyOptions = JSON.parse(newValue.propertyOptions)
        }
        this.template.properties[propertyId] = newValue;
        console.log('Changed', this.template.properties)
        this.nodesKey += 1;
      }
    },
    data () {
      return {
        template: {},
        tab: null,
        nodesKey: 1 // Used to force update the nodes-list view
      }
    },
    created () {
      this.getTemplate()
    }
  }
</script>

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
            this.template = response.body;
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
        this.template.properties.splice(this.template.properties.indexOf(property));
      },
      propertyChanged (property, newValue) {
        this.template.properties[this.template.properties.indexOf(property)] = newValue;
      }
    },
    data () {
      return {
        template: {},
        tab: null
      }
    },
    created () {
      this.getTemplate()
    }
  }
</script>

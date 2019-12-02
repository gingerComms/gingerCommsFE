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

      <v-card-title class="headline" style="display: block;">
        <div>{{ template.name }}</div>
        <div>
          <v-chip
            :color="template.pillBackgroundColor"
            small
            :style="{ 'color': template.pillForegroundColor }"
          >Template</v-chip>
        </div>
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

          <v-tab href="#nodes">
            Topics
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>
          <v-tab href="#nodes-scrumboard">
            Topics Scrumboard
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>
          <v-tab href="#details">
            Details
            <v-icon>mdi-pen</v-icon>
          </v-tab>
          <v-tab href="#properties">
            Properties
            <v-icon>mdi-playlist-edit</v-icon>
          </v-tab>
          <v-tabs-items v-model="tab">
            <v-tab-item value="nodes">
              <nodes-list
                :template="template"
                :key="nodesListKey"
                :parentType="'team'"
                :parentId="$route.params.teamId"
                @nodeUpdated="nodesScrumboardKey += 1"
              ></nodes-list>
            </v-tab-item>

            <v-tab-item value="nodes-scrumboard">
              <nodes-scrumboard
                :template="template"
                :key="nodesScrumboardKey"
                :parentType="'team'"
                :parentId="$route.params.teamId"
                @nodeUpdated="nodesListKey += 1"
              ></nodes-scrumboard>
            </v-tab-item>

            <v-tab-item value="details">
              <template-edit
                v-if="template"
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
                @propertiesOrderChanged="propertiesOrderChanged"
              ></template-properties-list>
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
  import NodesScrumboard from './NodesScrumboard';
  require("../styles/templates-detail.scss");

  export default {
    name: 'templates-detail',
    props: [],
    components: {
      TemplateEdit,
      TemplatePropertiesList,
      NodesList,
      NodesScrumboard
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
        this.template = template;
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
        this.nodesListKey += 1;
        this.nodesScrumboardKey += 1;
      },
      propertiesOrderChanged (newValue) {
        var properties = newValue;
        properties.forEach(function (prop) {
          if (typeof(prop.propertyOptions) == 'string') {
            prop.propertyOptions = JSON.parse(prop.propertyOptions);
          }
        })
        this.template.properties = properties;
      }
    },
    data () {
      return {
        template: {},
        tab: null,
        nodesListKey: 1,
        nodesScrumboardKey: 1 // Used to force update the nodes-list view
      }
    },
    created () {
      this.getTemplate()
    }
  }
</script>

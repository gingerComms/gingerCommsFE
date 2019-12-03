<template>
  <div class="template-content" id="nodes-detail" color="#55cec7">
    <div v-if="this.template && this.formdata">
      <v-btn
          color="#55cec7"
          dark
          fab
          small
          id="back-btn"
          elevation="0"
          @click="$router.back()"
        >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div id="breadcrumbs">
        <v-breadcrumbs large :items="breadcrumbsData">
        </v-breadcrumbs>
      </div>
      <v-card
        raised
        id="base-card"
        >
        <v-card-title class="headline" style="display: block;">

          <v-row>
            <v-col cols="6" xs="12">
              {{ node.title }}
            </v-col>
            <v-col cols="6" xs="12" class="text-lg-right">
              <v-chip
                :color="template.pillBackgroundColor"
                small
                :style="{ 'color': template.pillForegroundColor }"
              >{{ template.name }}</v-chip>

              <favorite-node-star
                :isFavorite="node.isFavorite"
                :nodeId="node.id"
                :nodeType="'coreVertex'"
                :key="favoritesKey"
                @nodeFavoriteToggled="nodeFavoriteToggled"
              ></favorite-node-star>
            </v-col>
          </v-row>


        </v-card-title>

        <v-card-text>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="#55cec7"
            left
            flat
            icons-and-text
            height=64

          >
            <v-tabs-slider></v-tabs-slider>

            <v-tab href="#details">
              Details
              <v-icon>mdi-pen</v-icon>
            </v-tab>

            <v-tab v-if="nodeCanHaveChildren" href="#nodes" @click="nodesKey += 1">
              Topics
              <v-icon>mdi-format-list-bulleted</v-icon>
            </v-tab>

            <v-tab href="#node-messages">
              Messages
              <v-icon>mdi-android-messages</v-icon>
            </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item value="details">
              <v-card
                outlined
                tile
              >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn small
                    color="#55cec7"
                    raised
                    dark
                    @click="resetFormdata"
                  >Reset</v-btn>
                  <v-btn small
                    color="#55cec7"
                    raised
                    dark
                    @click="updateNode"
                  >Update</v-btn>
                </v-card-actions>

                <v-card-text>
                  <v-row>
                    <v-col cols="6" xs="12" class="property-input-col">
                      <v-text-field
                        v-model="formdata.title"
                        label="Title"
                        placeholder="Title"
                        filled
                        dense
                        rounded
                        background-color="#f7f9fc"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      v-for="property in sortedProperties"
                      v-bind:key="property.id"
                      cols="6"
                      xs="12"
                      class="property-input-col"
                    >
                      <template-property-input
                        :fieldType="property.fieldType"
                        v-model="formdata.templateData[property.id]"
                        :label="property.name"
                        :propertyOptions="property.propertyOptions"
                        v-if="property.fieldType != 'select'"
                      ></template-property-input>
                      <template-property-input
                        :fieldType="property.fieldType"
                        v-model="formdata.templateData[property.id].value"
                        :label="property.name"
                        :propertyOptions="property.propertyOptions"
                        v-if="property.fieldType == 'select'"
                      ></template-property-input>
                    </v-col>
                  </v-row>

                  <div id="content-container">
                    <!-- <label>Content</label> -->
                    <tiptap-vuetify
                      v-model="formdata.content"
                      :extensions="editorExtensions"
                      class="editor-box"
                    >
                    </tiptap-vuetify>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

              <v-tab-item v-if="nodeCanHaveChildren" value="nodes">
                <nodes-tree-view
                  :parentNodeType="'coreVertex'"
                  :parentNodeId="$route.params.nodeId"
                  :parentCanHaveChildren="nodeCanHaveChildren"
                ></nodes-tree-view>
              </v-tab-item>

              <v-tab-item value="node-messages">
                <node-messages
                  :nodeId="$route.params.nodeId"
                  :nodeType="'coreVertex'"
                ></node-messages>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card-text>
      </v-card>
    </div>

  </div>
</template>

<script>
  import TemplatePropertyInput from './TemplatePropertyInput';
  import NodesTreeView from './NodesTreeView';
  import NodeMessages from './NodeMessages';
  import FavoriteNodeStar from './FavoriteNodeStar';
  import { TiptapVuetify, Heading, Bold, Italic, Strike, Underline, Code, Paragraph, BulletList, OrderedList, ListItem, Link, Blockquote, HardBreak, HorizontalRule, History } from 'tiptap-vuetify';
  import _ from 'lodash';

  require("../styles/nodes-detail.scss");

  export default {
    name: 'nodes-detail',
    props: [],
    components: {
      TemplatePropertyInput,
      TiptapVuetify,
      NodesTreeView,
      NodeMessages,
      FavoriteNodeStar
    },
    computed: {
      nodeCanHaveChildren () {
        if (this.template.canHaveChildren) {
          return true;
        }
        return false
      },
      detailUrl () {
        var nodeId = this.$route.params.nodeId;
        return process.env.VUE_APP_API_URL + '/coreVertex/'+nodeId;
      },
      sortedProperties () {
        var props = this.template.properties;

        props.forEach(function (prop) {
          if (typeof(prop.propertyOptions) == 'string') {
            prop.propertyOptions = JSON.parse(prop.propertyOptions);
          }
        })

        props.sort((a, b) => {
          return a.index - b.index
        })

        return this.template.properties
      },
      formdataChanged () {
        var currentFormdata = this.formdata;
        var blankFormdata = this.generateBlankFormdata();
        if (!_.isEqual(currentFormdata, blankFormdata)) {
          return true;
        }
        return false;
      },
      breadcrumbsData () {
        var items = [];
        var that = this;
        this.node.path.forEach(node => {
          if (node.label == "coreVertex") {
            items.push({
              text: node.displayName,
              disabled: false,
              to: '/teams/'+that.node.path[0].id+'/'+node.id
            })
          } else {
            items.push({
              text: node.displayName,
              disabled: false,
              href: '/#/teams/'+node.id,
              link: false
            })
          }
        })
        return items;
      }
    },
    methods: {
      generateBlankFormdata () {
        // Generates a default formdata dictionary based on the given node
        // and the template properties
        var that = this;
        var formdata = { title: this.node.title, templateData: {} }
        this.template.properties.forEach(function (prop) {
          formdata.templateData[prop.id] = that.node.templateData[prop.id] || ''
        })
        formdata['content'] = this.node.content;
        return formdata
      },
      getNode () {
        this.$http.get(this.detailUrl).then(response => {
          if (response.status == 200) {
            var node = response.body;
            if (typeof(node.templateData) == 'string') {
              node.templateData = JSON.parse(node.templateData);
            }
            this.node = node;
            this.template = this.node.template;
            this.formdata = this.generateBlankFormdata();
          }
        })
      },
      resetFormdata () {
        this.formdata = this.generateBlankFormdata();
      },
      updateNode () {
        var formdata = {
          title: this.formdata.title,
          templateData: JSON.stringify(this.formdata.templateData),
          content: this.formdata.content
        }
        
        this.$http.put(this.detailUrl, formdata).then(response => {
          if (response.status == 200) {
            var node = response.body;
            if (typeof(node.templateData) == 'string') {
              node.templateData = JSON.parse(node.templateData);
            }
            this.node.title = node.title;
            this.node.content = node.content;
            this.node.templateData = node.templateData;
            this.formdata = this.generateBlankFormdata();
          }
        })
      },
      nodeFavoriteToggled () {
        this.node.isFavorite = !this.node.isFavorite;
        this.favoritesKey += 1;
      }
    },
    data () {
      return {
        node: null,
        template: null,
        tab: null,
        formdata: null,
        nodesKey: 1,
        editorExtensions: [
          History,
          Blockquote,
          Link,
          Underline,
          Strike,
          Italic,
          ListItem,
          BulletList,
          OrderedList,
          [Heading, {
            options: {
              levels: [1, 2, 3]
            }
          }],
          Bold,
          Code,
          HorizontalRule,
          Paragraph,
          HardBreak
        ],
        favoritesKey: 1
      }
    },
    created () {
      this.getNode();
    }
  }
</script>

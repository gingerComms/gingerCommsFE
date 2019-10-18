<template>
  <div id="teams-detail" class="template-content">
    <v-tabs
      v-model="tab"
      background-color="#55cec7"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#templates">
        Templates
        <v-icon>mdi-clipboard-text</v-icon>
      </v-tab>

      <v-tab href="#members">
        Members
        <v-icon>mdi-clipboard-text</v-icon>
      </v-tab>

      <v-tabs-items v-model="tab">
        <v-tab-item value="templates">
          <v-card flat>
            <v-card-text>
              <templates-list :teamId="$route.params.teamId"></templates-list>
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item value="members">
          <v-card flat>
            <v-card-text>
              <members-list :nodeId="$route.params.teamId"></members-list>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
  require("../styles/teams-detail.scss");

  import { VTabs, VTab, VTabsSlider, VTabItem, VTabsItems } from "vuetify/lib";
  import TemplatesList from "./TemplatesList";
  import MembersList from './MembersList';

  export default {
    name: 'teams-detail',
    components: {
      VTabs,
      VTab,
      VTabsSlider,
      VTabItem,
      VTabsItems,
      TemplatesList,
      MembersList
    },
    props: [],
    data () {
      return {
        tab: null
      }
    }
  }
</script>
<template>
  <div id="list-tab-view">
    <div class="content-container">

      <div class="row" v-if="tabMode">
        <div v-for="object in objects" v-bind:key="object.id" class="tab-col col-lg-4 col-md-6">
          <!-- Tab Col Container -->
          <div v-if="tabMode" class="tab-object-container">
            <div class="tab-object-header row">
              <h3 class="col">
                <a @click="goToDetail(object)">
                  {{ object.tabsData.title }}
                </a>
              </h3>

              <v-menu bottom left class="col">
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <slot name="tabUtils" :team="object"></slot>
              </v-menu>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="count bg-light-blue">
                  <strong>{{ object.tabsData.leftCount }}</strong>
                  <span class="label">{{ object.tabsData.leftLabel }}</span>
                </div>
              </div>
              <div class="col-6">
                <div class="count bg-purple">
                  <strong>{{ object.tabsData.rightCount }}</strong>
                  <span class="label">{{ object.tabsData.rightLabel }}</span>
                </div>
              </div>
            </div>

            <div class="tab-footer">
              <div class="row align-items-center">
                <div class="col-8 tab-badges row">
                  <ul class="col-1" v-for="badge in object.tabsData.bottomLeftBadges" v-bind:key="badge.id">
                    <li>
                      <div class="badge">
                        <img _ngcontent-c2="" :title="badge.title" :src="badge.image">
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="col-4 chat-icon">
                  <a href="#">
                    <img _ngcontent-c2="" alt="" src="../assets/images/icons/icon-envelope2.png">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- / Tab Col Container -->

      <!-- List Col Container -->
      <div class="row" v-if="listMode">
        <div class="list-col col-12">
          <!-- / Tab Col Container -->
          <!-- List Col Container -->
          <div v-if="listMode" class="list-object-container">
            <v-data-table
              :headers="headers"
              :items="listData"
              :loading="isLoading"
              hide-default-footer
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:body="{ items }">
                <tbody v-if="items.length >= 0">
                  <tr v-for="item in items" :key="item.id">
                    <td v-for="header in headers" :key="header.value">
                      <span v-if="header.value != 'utils'" @click="goToDetail(item)">
                        <span v-if="!header.editable">
                          {{ item[header.value] }}
                        </span>
                        <span v-if="header.editable">
                          <slot :name="'listItem.' + header.value + '.editable'" :object="item"></slot>
                        </span>
                      </span>
                      <span v-if="header.value == 'utils'">
                        <slot name="listUtils" :object="item"></slot>
                      </span>
                    </td>
                  </tr>
                </tbody>
                <tbody v-if="items.length == 0">
                  <tr class="v-data-table__empty-wrapper">
                    <td colspan="6">No data available</td>
                  </tr>
                </tbody>
              </template>

              <template v-slot:no-data>
                No data
              </template>

              <template v-slot:top>
                <slot name="listTopContent"></slot>
              </template>
            </v-data-table>
          </div>
        </div>
      </div>
      <!-- / List Col Container -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ListTabView',
    props: {
      objects: Array,
      mode: String,
      headers: Array,
      isLoading: Boolean
    },
    computed: {
      tabMode () {
        return this.mode == 'tabs'
      },
      listMode () {
        return this.mode == 'list'
      },
      listData () {
        var data = [];
        this.objects.forEach(function(object) {
          data.push(object.listData);
        })
        return data;
      }
    },
    methods: {
      goToDetail (object) {
        if (object.route !== null && object.route != undefined) {
          this.$router.push({ path: object.route })
        }
      }
    },
    data () {
      return {

      }
    }
  }

  /*
    Format for TAB Objects:
      {
        title: String,
        bottomLeftBadges: Array of Objects => (
          badge => ({
            id: String,
            title: String,
            image: String (URL)
          })
        ),
        leftCount: Integer,
        rightCount: Integer,
        leftLabel: String,
        rightLabel: String
      }

    Format\s for List Objects:
      - Must have the `headers` prop supplied
      {
        propertyName<String>: value<String> ; for each header in the headers prop
      }

      - `headers` prop format:
        [
          {
            text: String, // DisplayName
            value: String // Value it maps to on object,
            editable: Boolean
          }
        ]

      It is expected that all Editable headers will have their own listItem.<header.name>.editable prop supplied

    At the end, object should be formatted as:
      {
        id: Integer,
        route: String, // Path to the detail page; can be blank
        tabsData: {},
        listData: {}
      }
  */
</script>

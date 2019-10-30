<template>
  <div idd="nodes-tree-view">
    <v-card>
      <v-card-text>
        <v-btn
          raised
          color="#55cec7"
          dark
          class="mb-2"
          @click="openCreateDialog(parentNodeId)"
        >Create Topic</v-btn>

        <v-treeview
          open-all
          :items="nodes"
          item-children="children"
          item-key="id"
          item-text="title"
          hoverable
        >
          <template v-slot:append="{ item }">
            <v-row>
              <v-col
                cols="9"
                style="text-align: left;">
                <v-chip
                  :color="item.template.pillBackgroundColor"
                  small
                  :style="{ 'color': item.template.pillForegroundColor }"
                >Topic: {{ item.template.name }}</v-chip>
              </v-col>

              <v-col
                cols="3">
                <v-btn
                  icon
                  @click="openCreateDialog(item.id)"
                  v-if="nodes.indexOf(item) >= 0"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                  icon
                  :to="'/teams/'+$route.params.teamId+'/templates/'+item.template.id+'/'+item.id"
                >
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <template v-slot:label="{ item }">
            <strong>{{ item.title }}</strong>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>

    <create-node-dialog
      :parentNodeId="createTargetParentNode.id"
      :parentNodeType="'coreVertex'"
      :showDialog="showCreateDialog"
      v-if="createTargetParentNode"
      @dialogToggled="createDialogToggled"
      @nodeCreated="nodeCreated"
    ></create-node-dialog>
  </div>
</template>

<script>
  import CreateNodeDialog from './CreateNodeDialog';

  export default {
    name: 'nodes-tree-view',
    props: {
      parentNodeType: String,
      parentNodeId: String,
    },
    components: {
      'create-node-dialog': CreateNodeDialog
    },
    computed: {
      apiUrl () {
        return process.env.VUE_APP_API_URL + '/' + this.parentNodeType + '/' + this.parentNodeId + '/tree_view';
      }
    },
    methods: {
      getNodesWithChildren () {
        this.$http.get(this.apiUrl).then(response => {
          this.nodes = response.body;
        })
      },
      openCreateDialog (nodeId) {
        this.createTargetParentNode = { id: nodeId };
        this.showCreateDialog = true;
      },
      createDialogToggled (newValue) {
        this.showCreateDialog = newValue;
        this.createTargetParentNode = null;
      },
      nodeCreated (node, parentNodeId) {
        if (parentNodeId !== this.parentNodeId) {
          var parentNodeIndex = this.nodes.indexOf(this.nodes.filter(item => item.id == parentNodeId)[0])
          this.nodes[parentNodeIndex].children.push(node);
        } else {
          this.nodes.push(node);
        }
      }
    },
    data () {
      return {
        tree: [],
        open: [], // All nodes that are toggled open right now
        nodes: [],
        createTargetParentNode: null,
        showCreateDialog: false
      }
    },
    created () {
      this.getNodesWithChildren();
    }
  }
</script>

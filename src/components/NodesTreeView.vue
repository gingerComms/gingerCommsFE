<template>
  <div idd="nodes-tree-view">
    <v-card>
      <v-card-text>
        <v-btn
          icon
          @click="nodeMoved({ id: parentNodeId })"
          v-if="movingNode != null && !nodeIsAtRoot(movingNode) && parentCanHaveChildren"
        >
          <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
        </v-btn>
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
                :cols="nodes.indexOf(item) >= 0 && item.template.canHaveChildren ? 8:9"
                style="text-align: left;">
                <v-chip
                  :color="item.template.pillBackgroundColor"
                  small
                  :style="{ 'color': item.template.pillForegroundColor }"
                >Topic: {{ item.template.name }}</v-chip>
              </v-col>

              <v-col
                :cols="nodes.indexOf(item) >= 0 && item.template.canHaveChildren ? 4:3"
                style="text-align: right;">
                <v-btn
                  icon
                  @click="openCreateDialog(item.id)"
                  v-if="nodes.indexOf(item) >= 0 && item.template.canHaveChildren"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
                <favorite-node-star
                  :isFavorite="item.isFavorite"
                  :nodeId="item.id"
                  :nodeType="'coreVertex'"
                  :key="favoritesKey"
                  @nodeFavoriteToggled="nodeFavoriteToggled"
                ></favorite-node-star>
                <v-btn
                  icon
                  :to="'/teams/'+$route.params.teamId+'/'+item.id"
                >
                  <v-icon>mdi-pen</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>

          <template v-slot:label="{ item }">
            <strong>{{ item.title }}</strong>
          </template>

          <template v-slot:prepend="{ item }">
            <v-btn
              icon
              @click="movingNode = item.id;"
              v-if="movingNode == null && movingNode != item.id"
            >
              <v-icon>mdi-cursor-move</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="movingNode = null;"
              v-if="movingNode == item.id"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="nodeMoved(item)"
              v-if="movingNode != null && movingNode != item.id && item.template.canHaveChildren"
            >
              <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
            </v-btn>
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
  import FavoriteNodeStar from './FavoriteNodeStar';

  export default {
    name: 'nodes-tree-view',
    props: {
      parentNodeType: String,
      parentNodeId: String,
      parentCanHaveChildren: Boolean
    },
    components: {
      'create-node-dialog': CreateNodeDialog,
      FavoriteNodeStar
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
      nodeFavoriteToggled (nodeId) {
        var node = this.nodes.filter(node => node.id == nodeId)[0];
        var index = this.nodes.indexOf(node);
        if (index <= -1) {
          this.nodes.forEach(function (node) {
            node.children.forEach(function (child) {
              if (child.id == nodeId) {
                child.isFavorite = !child.isFavorite
              }
            })
          })
        } else {
          this.nodes[index].isFavorite = !this.nodes[index].isFavorite;
        }
        this.favoritesKey += 1;
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
      },
      nodeMoved (dropLocation) {
        var apiUrl = process.env.VUE_APP_API_URL + '/coreVertex/' + this.movingNode + '/change_parent';
        var that = this;
        // eslint-disable-next-line
        this.$http.put(apiUrl, {newParent: dropLocation.id}).then(response => {
          that.getNodesWithChildren();
          that.movingNode = null;
          /*
          var movedNode = that.nodes.filter(node => node.id == that.movingNode)[0];
          var movedNodeIndex = that.nodes.indexOf(movedNode);
          var droppedAtNode = that.nodes.filter(node => node.id == dropLocation.id)[0];
          var droppedAtNodeIndex = that.nodes.indexOf(droppedAtNode);

          if (movedNodeIndex >= 0) {
            that.nodes.splice(movedNodeIndex, 1);
          } else {
            that.nodes[droppedAtNodeIndex].children.splice(
              that.nodes[droppedAtNodeIndex].children.indexOf(
                that.nodes[droppedAtNodeIndex].children.filter(child => child.id == that.movingNode)[0]
              )
            )
          }
          if (droppedAtNodeIndex >= 0) {
            that.nodes[droppedAtNodeIndex].children.push(movedNode);
          }
          that.movingNode = null;
          */
        })
      },
      nodeIsAtRoot (nodeId) {
        if (this.nodes.filter(node => node.id == nodeId)[0] != undefined) {
          return true;
        }
        return false;
      }
    },
    data () {
      return {
        tree: [],
        open: [], // All nodes that are toggled open right now
        nodes: [],
        createTargetParentNode: null,
        showCreateDialog: false,
        movingNode: null,
        favoritesKey: 1
      }
    },
    created () {
      this.getNodesWithChildren();
    }
  }
</script>

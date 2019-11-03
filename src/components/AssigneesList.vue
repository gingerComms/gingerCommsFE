<template>
  <div id="assignees-list">
    <v-card
      flat
      v-if="this.assignees.length >= 0"
    >
      <v-card-text>
        <ListTabView
          :headers="assigneeHeaders"
          :objects="listTabViewFormattedData"
          mode="list"
          :isLoading="false"
          :isDraggable="false"
        >
          <template v-slot:listTopContent>
            <v-card flat>
              <v-card-text>
                <v-btn
                  color="#55cec7"
                  raised
                  dark
                  @click="showDialog = true"
                >Add Member</v-btn>
              </v-card-text>
            </v-card>
          </template>

          <template v-slot:listUtils="{ object }">
            <v-btn
              icon
              @click="deleteAssignee(object.id)"
              v-if="object.id != $store.state.common.user.id"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

          <template v-slot:listItem.role.editable="{ object }">
            <v-edit-dialog
              style="padding-top: 12px;"
              v-if="object.id != $store.state.common.user.id"
            > {{ roleToTextMap[object.role] }}
              <template v-slot:input>
                <v-select
                  v-model="object.role"
                  :items="roleOptions"
                  item-text="text"
                  item-value="value"
                  filled
                  label="Role"
                  single-line
                  background-color="#f7f9fc"
                  color="green darken-1"
                  @change="roleEditted(object)"
                ></v-select>
              </template>
            </v-edit-dialog>
            <span v-if="object.id == $store.state.common.user.id">
              {{ roleToTextMap[object.role] }}
            </span>
          </template>
        </ListTabView>
      </v-card-text>
    </v-card>
    <assign-user-to-node-dialog
      :nodeId="nodeId"
      :nodeType="nodeType"
      :showDialog="showDialog"
      :roleOptions="roleOptions"
      :apiUrl="apiUrl"
      @assigneeAdded="assigneeAdded"
      @dialogToggled="showDialog = false;"
    ></assign-user-to-node-dialog>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import AssignUserToNodeDialog from './AssignUserToNodeDialog';

  export default {
    name: 'assignees-list',
    props: ['nodeType', 'nodeId'],
    components: {
      ListTabView,
      AssignUserToNodeDialog
    },
    computed: {
      apiUrl () {
        return process.env.VUE_APP_API_URL+'/'+this.nodeType+'/'+this.nodeId+'/assignees';
      },
      listTabViewFormattedData () {
        var objects = [];
        this.assignees.forEach(function (assignee) {
          var listData = {
            id: assignee.id,
            email: assignee.email,
            role: assignee.role
          }
          objects.push({
            id: assignee.id,
            listData: listData,
            tabsData: [],
            route: null
          })
        })
        return objects;
      },
      roleOptions () {
        if (this.nodeType == 'team') {
          return [
            { text: 'Admin', value: 'team_admin' },
            { text: 'Lead', value: 'team_lead' },
            { text: 'Member', value: 'team_member' }
          ]
        } else {
          return [
            { text: 'Admin', value: 'cv_admin' },
            { text: 'Lead', value: 'cv_lead' },
            { text: 'Member', value: 'cv_member' }
          ]
        }
      }
    },
    methods: {
      getAssignees () {
        this.$http.get(this.apiUrl).then(response => {
          if (response.status == 200) {
            this.assignees = response.body;
          }
        })
      },
      deleteAssignee (id) {
        var apiUrl = this.apiUrl + '/' + id;
        var that = this;
        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            var deletedAssignee = that.assignees.filter(assignee => assignee.id == id)[0];
            that.assignees.splice(that.assignees.indexOf(deletedAssignee), 1);
          }
        })
      },
      assigneeAdded (newAssignee) {
        this.assignees.push(newAssignee);
      },
      roleEditted (object) {
        var apiUrl = this.apiUrl + '/' + object.id;
        var that = this;
        this.$http.put(apiUrl, { role: object.role }).then(response => {
          if (response.status == 200) {
            var changedAssignee = that.assignees.filter(assignee => assignee.id == object.id)[0];
            that.assignees[that.assignees.indexOf(changedAssignee)].role = response.body.role;
          }
        })
      }
    },
    data () {
      return {
        assignees: [],
        assigneeHeaders: [
          { text: 'Email', value: 'email', editable: false },
          { text: 'Role', value: 'role', editable: true },
          { text: 'Utils', value: 'utils', editable: false }
        ],
        roleToTextMap: {
          'team_admin': 'Admin',
          'team_lead': 'Lead',
          'team_member': 'Member',
          'cv_admin': 'Admin',
          'cv_lead': 'Lead',
          'cv_member': 'Member',
        },
        showDialog: false
      }
    },
    created () {
      this.getAssignees();
    }
  }
</script>

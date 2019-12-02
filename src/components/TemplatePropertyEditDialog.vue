<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="template-property-edit-dialog"
  >
    <v-card>
      <v-card-title class="headline">
        Edit Property Options
      </v-card-title>

      <v-card-text>
        <div v-if="property.fieldType == 'select'">
          <v-list
            flat>
            <draggable
              :group="'options'"
              :list="property.propertyOptions.options"
            >
              <v-list-item
                v-for="i in property.propertyOptions.options.length"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-edit-dialog
                    > {{ property.propertyOptions.options[i-1] }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="property.propertyOptions.options[i-1]"
                          label="Edit"
                          single-line
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon @click="property.propertyOptions.options.splice(property.propertyOptions.options.indexOf(property.propertyOptions.options[i-1]), 1)">mdi-delete</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </draggable>
          </v-list>

          <v-btn
            icon
            color="black"
            @click="property.propertyOptions.options.push('Option '+(property.propertyOptions.options.length+1))">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          text
          @click="dialogOpen=false; property = null;"
        >
          Cancel
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="propertyOptionsChanged(property)"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import draggable from 'vuedraggable';

  export default {
    name: 'template-property-edit-dialog',
    props: {
      showDialog: Boolean,
      property: Object
    },
    components: {
      draggable
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set (newValue) {
          this.$emit('propertyEditDialogClosed', newValue);
        }
      }
    },
    methods: {
      propertyOptionsChanged (property) {
        this.$emit('propertyOptionsChanged', property);
      }
    },
    data () {
      return {
        listModel: 1
      }
    }
  }
</script>

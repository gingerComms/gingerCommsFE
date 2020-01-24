<template>
  <div class="template-property-input">
    <!-- The purpose of this component is to return the correct input field
        based on the property's fieldType
    -->
    <v-text-field
      v-model="propertyValue"
      :label="label"
      :placeholder="label"
      v-if="fieldType == 'string'"
      filled
      dense
      rounded
      background-color="#f7f9fc"
    ></v-text-field>
    <v-text-field
      v-model="propertyValue"
      :label="label"
      :placeholder="label"
      v-if="fieldType == 'number'"
      type="number"
      filled
      dense
      rounded
      background-color="#f7f9fc"
    >
    </v-text-field>
    <v-select
      v-if="fieldType == 'select'"
      v-model="propertyValue"
      :items="propertyOptions.options"

      :label="label"
      color="green darken-1"
      filled
      dense
      rounded
      background-color="#f7f9fc"
    ></v-select>
    <v-menu
      v-if="fieldType == 'date'"
      v-model="openMenus['date']"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"

    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="propertyValue"
          :label="label"
          prepend-icon="event"
          readonly
          v-on="on"
          filled
          dense
          rounded
          background-color="#f7f9fc"
        ></v-text-field>
      </template>
      <v-date-picker v-model="propertyValue" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="openMenus['date'] = false"
        >OK</v-btn>
      </v-date-picker>
    </v-menu>
    <user-search-field
      v-if="fieldType == 'user'"
      v-model="propertyValue"
      :users="$store.state.common.activeTeamUsers"
    ></user-search-field>
    <v-card
      flat
      outlined
      v-if="fieldType == 'file'"
    >
      <v-card-text class="files">
        <v-card
          v-for="file in value.files"
          v-bind:key="file.name"
          flat
          class="uploaded-file-card"
          :ripple="false"
        >
          <v-card-text>
            <v-row>
              <v-col cols="8">{{ file.name }}</v-col>
              <v-col cols="4">
                <v-btn
                  fab
                  small
                  elevation="0"
                  @click="deleteFile(file)"
                ><v-icon>mdi-delete</v-icon></v-btn>
                <v-btn
                  fab
                  small
                  elevation="0"
                  @click="downloadFile(file)"
                ><v-icon>mdi-cloud-download</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <vue-dropzone
          ref="fileDropzone"
          id="dropzone"
          :options="dropzoneOptions"
          :awss3="awsS3Options"
          v-on:vdropzone-success="s3UploadSuccess"
          v-if="fieldType == 'file'"
          :useCustomSlot="true"
          v-on:vdropzone-queue-complete="allFilesUploaded"
          :include-styling="true"
          v-bind:key="dropzoneKey"
          @vdropzone-files-added="filesAdded"
        >
          <div class="dropzone-custom-content pa-4">
            Drop files here!
          </div>
        </vue-dropzone>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import UserSearchField from './UserSearchField';
  import vue2Dropzone from 'vue2-dropzone'
  import 'vue2-dropzone/dist/vue2Dropzone.min.css'
  require("../styles/template-properties-input.scss")

  export default {
    name: 'template-property-input',
    components: {
      UserSearchField,
      vueDropzone: vue2Dropzone
    },
    props: {
      fieldType: String,
      label: String,
      propertyOptions: Object,
      propertyId: String,
      nodeType: String,
      nodeId: String,
      value: [String, Object]
    },
    computed: {
      propertyValue: {
        get () {
          return this.value;
        },
        set (newValue) {
          this.$emit('input', newValue);
        }
      }
    },
    methods: {
      s3UploadSuccess (file) {
        var fileObj = { size: file.size, name: file.name, type: file.type }
        if (this.value == undefined || this.value.files == undefined) {
          this.$emit('input', {files: [fileObj]});
        } else {
          var files = this.value.files;
          files.push(fileObj);
          this.$emit('input', {files: files});
        }
      },
      allFilesUploaded () {
        this.$emit('filesUploaded', true);
        this.dropzoneKey += 1;
      },
      downloadFile (file) {
        var apiUrl = process.env.VUE_APP_API_URL + '/' + this.nodeType + '/' + this.nodeId + '/' + this.propertyId + '/generate_s3_get';
        var formdata = { filePath: file.name }
        this.$http.post(apiUrl, formdata).then(response => {
          window.open(response.body.url, '_blank');
        })
      },
      filesAdded (files) {
        var that = this;
        if (this.value == undefined || this.value.files == undefined) {
          that.$refs.fileDropzone.processQueue();
        } else {
          files.forEach(function (file) {
            that.value.files.forEach(function (uploadedFile) {
              if (file.name == uploadedFile.name) {
                that.$refs.fileDropzone.removeFile(file);
              }
            })
          })
          that.$refs.fileDropzone.processQueue();
        }
      },
      deleteFile (file) {
        var apiUrl = process.env.VUE_APP_API_URL + '/' + this.nodeType + '/' + this.nodeId + '/' + this.propertyId + '/delete_file';
        var formdata = { filePath: file.name };
        var fileIndex = this.value.files.indexOf(file);
        var that = this;
        this.$http.post(apiUrl, formdata).then(response => {
          if (response.status == 200) {
            that.value.files.splice(fileIndex, 1);
            that.$emit('filesUploaded', true); // Used to update the property immediately
          }
        })
      }
    },
    data () {
      return {
        openMenus: {},
        dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          headers: { "My-Awesome-Header": "header value" },
          autoProcessQueue: false
        },
        awsS3Options: {
          signingURL: () => {
            return process.env.VUE_APP_API_URL + '/' + this.nodeType + '/' + this.nodeId + '/' + this.propertyId + '/generate_s3_post'
          },
          headers: {
            'Authorization': 'Bearer ' + this.$store.state.common.authToken
          },
          sendFileToServer: false
        },
        dropzoneKey: 1
      }
    }
  }
</script>

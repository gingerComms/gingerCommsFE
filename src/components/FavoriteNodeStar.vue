<template>
  <v-btn
    icon
    @click="toggleFavoriteNode()"
    class="favorite-node-star"
    :disabled="disabled">
    <v-icon v-if="!isFavorite" color="#55cec7">
      mdi-star-outline
    </v-icon>
    <v-icon v-if="isFavorite" color="orange">
      mdi-star
    </v-icon>
  </v-btn>
</template>

<script>
  export default {
    name: 'favorite-node-star',
    props: {
      isFavorite: Boolean,
      nodeId: String,
      nodeType: String,
      disabled: Boolean
    },
    methods: {
      toggleFavoriteNode () {
        if (this.isFavorite) {
          this.removeFavorite();
        } else {
          this.favoriteNode();
        }
      },
      favoriteNode () {
        var apiUrl = process.env.VUE_APP_API_URL + '/favorite_nodes';
        var formdata = {
          nodeId: this.nodeId,
          nodeType: this.nodeType
        };
        this.$http.post(apiUrl, formdata).then(response => {
          if (response.status == 201) {
            console.log(response);
            this.$emit('nodeFavoriteToggled', this.nodeId)
          }
        })
      },
      removeFavorite () {
        var apiUrl = process.env.VUE_APP_API_URL+'/favorite_nodes/'+this.nodeType +'/'+this.nodeId;
        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.$emit('nodeFavoriteToggled', this.nodeId)
          }
        })
      }
    },
    data () {
      return {

      }
    }
  }
</script>

<template>
  <div class="container">
    <header class="jumbotron">
      <h3 style="text-align: center;">{{ content }}</h3>
    </header>
  </div>
</template>

<script>

export default {
  name: "NotFound",
  data() {
    return {
      content: "",
    };
  },
  mounted() {
    if(this.$route.query.message){
      this.content=this.$route.query.message;
    }
    else{
      this.content="דף לא נמצא";
    }
  },
};
</script>

<template>
  <div class="clear"></div>
  <footer class="bg-black text-center text-white fixed-bottom">
    <!-- Grid container -->
    <div class="text-center p-3">
      © 2022 Copyright:
      <span class="text-white">Chengdu University of Information Technology's Student <br />
        <span class="poweredBy">Powered by VUE 3.x and .NET 6 on Docker;</span>
      </span>
    </div>
  </footer>
</template>
<style scoped>
footer {
  height: 75px;
  bottom: 0;
  width: 100%;
}
.poweredBy {
  font-size: 15;
  font-style: italic;
}
.clear {
  clear: both;
  height: 80px;
}
</style>
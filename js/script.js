$(document).ready(() => {
  lightGallery(document.getElementById("aniimated-thumbnials"), 
  {
    addClass: 'gallery-imgddd',
    thumbnail: true
  });
  $("#hamburger-button").click(e => {
    $("#hamburger-button").toggleClass("show");
    $("#slide-panel").toggleClass("open");
  });
  // var feed = new Instafeed({
  //   accessToken: "445632943.c4d20dc.379c66e111a44c7d9a3f2e3c2ca4907b",
  //   clientId: "c4d20dcb5a1240ce8f543a48a0e969b4",
  //   get: "user",
  //   addClass: "gallery-img",
  //   userId: "8535532406",
  //   resolution: "low_resolution",
  //   template:
  //     '<div class="col-3"><div class="instagram-image-wraper">{{likes}}<a class="test" href="{{link}}"><img src="{{image}}" /></a></div></div>',
  //   limit: 12,
  //   target: "inst"
  // });
  // feed.run();
  // console.log(feed);
});

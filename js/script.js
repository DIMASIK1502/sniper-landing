$(window).scroll(function() {
  var hT = $("#benefits").offset().top,
    hH = $("#benefits").outerHeight(),
    wH = $(window).height(),
    wS = $(this).scrollTop();
  if (wS > hT + hH - wH) {
    $("#up-button").css({
      opacity: 1
    });
  } else {
    $("#up-button").css({
      opacity: 0
    });
  }
});
sendMail = (title, body, cb) => {
  Email.send({
    SecureToken: "f33c7167-29a8-410c-aceb-fd914a44284d",
    To: "dimasik1502@mail.ru",
    From: "dimasik.komarov.150298@gmail.com",
    Subject: title,
    Body: body
  }).then(message => {
    if (message === "OK") {
      cb && cb();
    }
  });
};

function getInstagramInfo(userId) {
  return $.ajax({
    url: `https://api.instagram.com/v1/users/${userId}/media/recent`, // or /users/self/media/recent for Sandbox
    dataType: "jsonp",
    type: "GET",
    data: {
      access_token: "8535532406.be48457.5da252ed5603483e9b03329922ed244d",
      count: 20
    },
    success: function(data) {
      return data.data;
    },
    error: function(data) {
      return null;
    }
  });
}

$(document).ready(async () => {
  moment.locale("ru");
  const instagramData = await getInstagramInfo("8535532406");
  $("#callback-button").click(() => {
    const name = $("#input-name").val();
    const phone = $("#input-callback-phone").val();
    if (name && phone && $("#checkbox-call").prop("checked")) {
      sendMail(
        "Обратный звонок",
        `<p><span><b>Имя: </b>${name}</span></p><p><span><b>Телефон: </b>${phone}</span></p>`,
        () => {
          $("#input-name").val("");
          $("#input-callback-phone").val("");
          $("#callback-modal").modal("hide");
          $("#success-modal").modal("show");
        }
      );
    } else {
      $("#callback-button").notify("Заполните все поля", {
        position: "top center"
      });
    }
    //sendMail()
  });
  $("#sign-btn").click(() => {
    const name = $("#sign-input").val();
    const phone = $("#sign-phone").val();
    if (name && phone && $("#checkbox").prop("checked")) {
      sendMail(
        "Записаться на занятие",
        `<p><span><b>Имя: </b>${name}</span></p><p><span><b>Телефон: </b>${phone}</span></p>`,
        () => {
          $("#sign-input").val("");
          $("#sign-phone").val("");
          $("#sign-up-modal").modal("hide");
          $("#success-modal").modal("show");
        }
      );
    } else {
      $("#sign-btn").notify("Заполните все поля", {
        position: "top center"
      });
    }
  });
  IMask(document.getElementById("sign-phone"), {
    mask: "+{7}(000)000-00-00"
  });
  IMask(document.getElementById("input-callback-phone"), {
    mask: "+{7}(000)000-00-00"
  });
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 300
  });

  $("#up-button").click(() => {
    // f33c7167-29a8-410c-aceb-fd914a44284d
    //a5ff9ffa-626d-4ad6-a462-3138a459343d

    scroll.animateScroll(0);
  });

  lightGallery(document.getElementById("aniimated-thumbnials"), {
    addClass: "gallery-imgddd",
    thumbnail: true
  });
  $("#hamburger-button").click(e => {
    $("#hamburger-button").toggleClass("show");
    $("#slide-panel").toggleClass("open");
  });
  $(".nav-link").click(() => {
    $("#hamburger-button").toggleClass("show");
    $("#slide-panel").toggleClass("open");
  });

  //8535532406
  var mySwiper = new Swiper(".swiper-container", {
    centeredSlides: true,
    initialSlide: 1,
    slidesPerView: "auto",
    spaceBetween: 72,
    slideNextClass: "next-feed",
    slidePrevClass: "prev-feed"
  });
  if (instagramData) {
    console.log(instagramData);
    const formatedData = instagramData.data.map((item, key) => {
      const img = item.images.standard_resolution.url;
      const likes = item.likes.count;
      const tags = item.tags;
      const link = item.link;
      const profile = item.user.username;
      const location = item.location.name;
      const caption = item.caption;
      const profileImage = item.user.profile_picture;
      return `<div class="swiper-slide">
              <div class="slide-image" style="background-image: url(${img})"></div>
              <div class="slide-info">
               <div class="info-head">
                 <div class="gradient-border">
                  <div style="background-image: url(${profileImage})" class="head-icon"></div>
                 </div>
                 <div class="profile-wrapper">
                   <span class="profile-name">${profile}</span>
                   <span class="profile-location">${
                     location ? location : ""
                   }</span>
                 </div>
              </div>
              <div class="info-caption">
                <div class="caption-wrapper">
                 <div class="gradient-border">
                   <div style="background-image: url(${profileImage})" class="head-icon"></div>
                 </div>
                  <div class="profile-wrapper">
                  <span class="profile-name">${profile}</span>
                  <span class="profile-location">${
                    caption ? item.caption.text.replace(/#(\S*)/g, "") : ""
                  }</span>
                   <span class="profile-createdat">
                   ${
                     caption
                       ? moment(moment.unix(item.caption.created_time)).fromNow(
                           true
                         )
                       : ""
                   }
                   </span>
                  </div>
                </div>
              </div>
            </div>  
        </div>`;
    });
    mySwiper.appendSlide(formatedData);
    mySwiper.update();
    $("#next-btn").click(() => {
      mySwiper.slideNext();
    });
    $("#prev-btn").click(() => {
      mySwiper.slidePrev();
    });
  }
  // mySwiper.appendSlide()
  // var feed = new Instafeed({
  //   accessToken: "445632943.be48457.f69642d8b6294d99882c2054efb091cd",
  //   clientId: "be4845747d3446e9a005b51921a3505e",
  //   get: "user",
  //   addClass: "gallery-img",
  //   userId: "445632943",
  //   resolution: "low_resolution",
  //   template: '<div class="swiper-slide"><img src="{{image}}"/></div>',
  //   limit: 12,
  //   target: "inst",
  //   success: () => mySwiper.update()
  // });
  // feed.run();

  //console.log(feed);
});

var config = null;
var gallery = null;
var myMap = null;
var showMore = false;
var galleryType = "all";
var modalType = "";

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

function sendMail(title, body, cb) {
  switch (modalType) {
    case "1": {
      body += `<p><b>Тип занятия: </b> разовое</p>`;
      break;
    }
    case "4": {
      body += `<p><b>Тип занятия: </b> 4 занятия</p>`;
      break;
    }
    case "8": {
      body += `<p><b>Тип занятия: </b> 8 занятий</p>`;
      break;
    }
    case "personal": {
      body += `<p><b>Тип занятия: </b> индивидуальное</p>`;
      break;
    }
    case "group": {
      body += `<p><b>Тип занятия: </b> групповое занятие</p>`;
      break;
    }
    case "free": {
      body += `<p><b>Тип занятия: </b> бесплатное</p>`;
      break;
    }
  }

  Email.send({
    SecureToken: "f33c7167-29a8-410c-aceb-fd914a44284d",
    To: config.email,
    From: "dimasik.komarov.150298@gmail.com",
    Subject: title,
    Body: body
  }).then(message => {
    if (message === "OK") {
      cb && cb();
    }
  });
}
function setGallery(type) {
  galleryType = type;
  $("#aniimated-thumbnials").empty();
  const filteredList =
    type === "all"
      ? config.gallery
      : config.gallery.filter(a => {
          return a.type === type;
        });
  for (let i = 0; i < filteredList.length; i++) {
    const item = filteredList[i];
    const img = $("<a>", {
      class: "gallery-img",
      style: `background-image: url(${item.smallImage})`
    });
    img.click(() => {
      $("#aniimated-thumbnials").lightGallery({
        dynamic: true,
        index: i,
        dynamicEl: filteredList.map(a => {
          return {
            src: a.fullImage,
            thumb: a.fullImage
          };
        })
      });
    });
    $("#aniimated-thumbnials").append(img);
    if (!showMore && i >= 17) {
      break;
    }
  }
}
function getInstagramInfo(userId, cb) {
  return $.ajax({
    url: `https://api.instagram.com/v1/users/${userId}/media/recent`, // or /users/self/media/recent for Sandbox
    dataType: "jsonp",
    type: "GET",
    data: {
      access_token: "8535532406.be48457.5da252ed5603483e9b03329922ed244d",
      count: 20
    },
    success: function(data) {
      cb();
      return data.data;
    },
    error: function(data) {
      return null;
    }
  });
}
function getConfig() {
  return $.getJSON("/config.json", function(data) {
    config = data;
  });
}
function mapInit() {
  myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 10,
    controls: []
  });
}
function getPoints() {
  config.map.map((item, key) => {
    $("#address-list").append(`<span>${key + 1}. ${item.title}</span>`);
    myMap.geoObjects.add(
      new ymaps.Placemark(
        item.points,
        {
          hintContent: item.title,
          balloonContent: item.title
        },
        {
          // Опции.
          // Необходимо указать данный тип макета.
          iconLayout: "default#image",
          // Своё изображение иконки метки.
          iconImageHref: "img/map-point.png",
          // Размеры метки.
          iconImageSize: [29, 47]
        }
      )
    );
  });
}

$(document).ready(async () => {
  await getConfig();
  ymaps.ready(mapInit);
  moment.locale("ru");
  $("#aniimated-thumbnials").on("onCloseAfter.lg", function(event) {
    $("#aniimated-thumbnials")
      .data("lightGallery")
      .destroy(true);
  });
  const instagramData = await getInstagramInfo("8535532406", cb => {
    setGallery("all");
  });
  $("#gallery-btn-all").click(e => {
    setGallery("all");
    $("#gallery-btn-person").removeClass("active");
    $("#gallery-btn-group").removeClass("active");
    $("#gallery-btn-all").toggleClass("active");
  });
  $("#gallery-btn-group").click(e => {
    setGallery("group");
    $("#gallery-btn-person").removeClass("active");
    $("#gallery-btn-all").removeClass("active");
    $("#gallery-btn-group").toggleClass("active");
  });
  $("#gallery-btn-person").click(e => {
    setGallery("personal");
    $("#gallery-btn-all").removeClass("active");
    $("#gallery-btn-group").removeClass("active");
    $("#gallery-btn-person").toggleClass("active");
  });
  $("#show-more-btn").click(e => {
    showMore = !showMore;
    if (showMore) {
      $("#show-more-btn span").text("Скрыть");
    } else {
      $("#show-more-btn span").text("Показать больше");
    }
    setGallery(galleryType);
  });

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
  $("#sing-up-btn").click(() => {
    modalType = "free";
    $("#modal-title").html("Записаться на бесплатное занятие");
  });
  $("#personal-modal-btn").click(() => {
    modalType = "presonal";
    $("#modal-title").html("Записаться на индивидуальное занятие");
  });
  $("#group-modal-btn").click(() => {
    modalType = "group";

    $("#modal-title").html("Записаться на групповое занятие");
  });
  $("#once-modal-btn").click(() => {
    modalType = "1";
    $("#modal-title").html("Записаться на разовое занятие");
  });
  $("#four-modal-btn").click(() => {
    modalType = "4";
    $("#modal-title").html("Записаться на 4 занятия");
  });
  $("#eight-modal-btn").click(() => {
    modalType = "8";
    $("#modal-title").html("Записаться на 8 занятий");
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
        },
        "Беплатное занятие"
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
    slidePrevClass: "prev-feed",
    breakpoints: {
      1280: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      440: {
        allowSlidePrev: false,
        allowSlideNext: false
      }
    }
  });

  if (instagramData) {
    const formatedData = instagramData.data
      .filter(x =>
        config.reviewTag === "*" ? true : x.tags.includes(config.reviewTag)
      )
      .map((item, key) => {
        const img = item.images.standard_resolution.url;
        const likes = item.likes.count;
        const tags = item.tags;
        const link = item.link;
        const profile = item.user.username;
        const location = item.location.name;
        const caption = item.caption;
        const profileImage = item.user.profile_picture;
        return `<div class="swiper-slide">
                  <div class="slide-content">
                  <a target="_blank" href="${link}" class="slide-image" style="background-image: url(${img})"></a>
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
                           ? moment(
                               moment.unix(item.caption.created_time)
                             ).fromNow(true)
                           : ""
                       }
                       </span>
                      </div>
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

  $("#copyright").text(
    `© ${new Date().getFullYear()} sniperschool.ru. Все права защищены`
  );
  getPoints();
});

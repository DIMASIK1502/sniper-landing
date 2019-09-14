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
$(document).ready(() => {
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
        }
      );
    } else {
      $("#callback-button").notify("Заполните все поля", {
        position: "top center"
      });
    }
    //sendMail()
  });
  $('#sign-btn').click(()=>{
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
  $(".nav-link ").click(() => {
    $("#hamburger-button").toggleClass("show");
    $("#slide-panel").toggleClass("open");
  });

  var feed = new Instafeed({
    accessToken: "445632943.1677ed0.7044278c01a24a308024ed330f8b0337",
    clientId: "c4d20dcb5a1240ce8f543a48a0e969b4",
    get: "user",
    addClass: "gallery-img",
    userId: "8535532406",
    resolution: "low_resolution",
    template:
      '<div class="col-3"><div class="instagram-image-wraper">{{likes}}<a class="test" href="{{link}}"><img src="{{image}}" /></a></div></div>',
    limit: 12,
    target: "inst"
  });
  feed.run();
  // console.log(feed);
});

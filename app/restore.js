(function() { 
  var $, init;

  init = function() {
  // possible filter? .filter(function(idx) { return $(this).prop('href').})
    $ = this.jQuery;

    var $gb = $('#gb'),
      $nav = $gb.closest('[role=navigation]'),
      $gbwa = $('#gbwa'),
      $tilePopup = $('a[aria-haspopup=true].gb_n', $gb).filter(function(idx) { return /^https?:\/\/www\.google\.com\/intl\/[a-z]{2}\/options\/?$/.test($(this).prop('href')); }),
      $options = $('div[role=list] ul li a[data-pid]', $gb);


    if ($options.length) {
      var $sandbar = window.$sandbar = $('<div style="padding: 0.2em; font-size: 13px; white-space: nowrap; background-color: black; display: block; color: white"></div>').prependTo($gb);
      $nav.css({ "margin-bottom": "0px" });

      $options.each(function() { 
        var $option = $(this).appendTo($sandbar);

        // restylize
        $options.prop({ "class": '', "style": '' })
          .css({
            "padding": "0.1em 0.75em",
            "color": "white",
            "font-weight": "bold",
            "text-decoration": "none"
          })
          .find('span').prop({ "class": '', "style": '' });

      });

      $tilePopup.remove();

    }

  };
  if (!this.jQuery) {
    console.log('no jQuery?');
    var body = document.getElementsByTagName("body")[0];
    var script = document.createElement('script');
    var that = this;

    script.type = "text/javascript";
    script.src = "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
    script.onload = function() {
      init.call(that);
    };
    body.appendChild(script);
  }
  else {
    init();
  }
}).call(window);

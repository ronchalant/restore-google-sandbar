(function() { 
  var $, init, tries = 0;

  init = function() {
  // possible filter? .filter(function(idx) { return $(this).prop('href').})
    $ = this.jQuery;

    var $gb = $('#gb'),
      $nav = $gb.closest('[role=navigation]'),
      $gbwa = $('#gbwa'),
      $tilePopup = $('a[aria-haspopup=true].gb_n', $gbwa).filter(function(idx) { return /^https?:\/\/www\.google\.com\/intl\/[a-z]{2}\/options\/?$/.test($(this).prop('href')); }),
      $options = $('ul li a[data-pid]', $gbwa);


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
    else if (tries++ < 10) {
      // probably a better way to do this, but I'm being lazy ATM.
      console.log("trying again");
      setTimeout(init, 250);
    }
  };
  if (!this.jQuery) {
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

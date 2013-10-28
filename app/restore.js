(function() { 
  var $, init, tries = 0;

  init = function() {
  
    $ = this.jQuery;

    var $gb = $('#gb'),
      $nav = $gb.closest('[role=navigation]'),
      $gbwa = $('#gbwa'),
      $gbq = $('#gbq'), // query box container
      $tilePopup = $('a[aria-haspopup=true].gb_n', $gbwa).filter(function(idx) { return /^https?:\/\/www\.google\.com\/intl\/[a-z]{2}\/options\/?$/.test($(this).prop('href')); }),
      $options = $('ul li a[data-pid]', $gbwa),
    oneclicks = JSON.parse(localStorage.getItem("oneClickItems") || "{}"),
    saveOneClicks = function() { localStorage.setItem("oneClickItems", JSON.stringify(oneclicks)); },
    oneclickCount = function() {
      var count = 0, p = undefined;
      for (p in oneclicks) {
        if (oneclicks[p] === true) {
          count++;
        }
      }
      return count;
    },
    addOneClick = $.noop,
    resizeQuery = $.noop,
    removeOneClick = $.noop;

  // if we have google plus link, it's easier...
  var $gplus = $('#gb a[data-pid=119]').filter(function(idx) { return $(this).closest('#gbwa').length === 0; });
// console.log("gplus:")
// console.log($gplus);
  
  if ($gplus.length) {
    // ok this is pretty ugly .. but we need to get the first shared parent of the gplus block and the 
    // google query box, then stash one node below that guy towards gbq.  all because that guy needs to 
    // get cut down to size a bit as we add these one-clicks.
    // CURRENTLY this is just the parent of #gbq, but who knows how googlez might change up their stuff?
    (function() {
        var $gplusParents = $gplus.parentsUntil("#gb"),
          $gbqParents = $gbq.parentsUntil("#gb"),
		  $toResize = undefined;

        $gbqParents.each(function(gbqidx, gbqnode) {
          // if shared, pick the last one and exit
          $gplusParents.each(function(gplusidx, gplusnode) {
            if (gbqnode === gplusnode) {
              $toResize = $($gbqParents[Math.max(0, gbqidx-1)]);
              return false;
            }
          });
          if ($toResize !== undefined) {
            return false;
          }
        });

        if ($toResize && $toResize.length) {
			$toResize.css("flex-shrink", "20");
        }
    })();

    (function() {
      var $container = $gplus.parent();
	  
      // $app = anchor of the application we're toggling; should have something like:
      //  <a class="gb_a" id="gb8" href="https://maps.google.com/maps?hl=en&amp;tab=ml&amp;authuser=1" target="_blank" data-pid="8" data-ved="0CAcQwS4oBA"><span class="gb_c" style="background-position:-104px 0"></span><span class="gb_d">Maps</span></a>
      addOneClick = window.addOneClick = function($app) {
        // omit if pid exists
        var pid = $app.data('pid'),
          $oneclick = $('a[data-pid=' + pid + ']', $container);
// console.log('addOneClick([data-pid=' + pid + '])');
        if ($oneclick.length) {
          return $oneclick;
        }
        
        // add
        var text = $app.text(),
          minWidth;

        switch (text.length) {
          case 1:
          case 2:
          case 3:
          case 4: 
          case 5: 
            minWidth = '3em';
            break;

          case 6:
            minWidth = '4em';
            break;

          default:
            minWidth = '5em';
            break;
        }

        oneclicks["pid_" + pid] = true;
        saveOneClicks();

        return $('<a target="_blank" style="margin-left: 0.5em !important; min-width: ' + minWidth + '"></a>')
          .attr({
            href: $app.prop('href'),
            "data-pid": $app.data('pid'),
            "data-ved": $app.data('ved')
          })
          .html($app.text()) 
          .addClass($gplus.prop('class')) // uses classes from gplus as basis
          .appendTo($container);
      };
      
      removeOneClick = window.removeOneClick = function($app) {
        // omit if pid exists
        var pid = $app.data('pid'),
          $oneclick = $('a[data-pid=' + pid + ']', $container);
// console.log('removeOneClick([data-pid=' + pid + '])');        
        if ($oneclick.length) {
          oneclicks["pid_" + pid] = false;
          saveOneClicks();
          return $oneclick.remove();
        }
      };      
    })();
  }
// console.log("options:");  
// console.log($options);
    if ($options.length) {
    // add stuff..
    (function() {
    var toggle = function() {
// console.log('toggling');
// console.log(this);
      var $cbx = $(this),
        $app = $cbx.closest('li').find('a[data-pid]:first');
        
      if ($app.length) {
// console.log('found $app');
        if ($cbx.is(':checked')) {
          addOneClick($app);
        }
        else {
          removeOneClick($app);
        }
      }
    };
    
// console.log('iterating options:' + $options.length);
// console.log($options);
      $options.each(function(idx, a) { 
      var $a = $(a),
        $li = $a.closest('li'),
        pid = $a.data('pid'),
        checked = oneclicks["pid_" + pid]||false;
// console.log("on option pid=" + pid + ", " + $a.text());
      $li.append('<div style="position: relative"><input type="checkbox" data-oneclick="enabled" style="position: absolute; top: -45px; right: 15px;"></div>');
      if (checked) {
        toggle.call( $('[data-oneclick=enabled]', $li).prop('checked', true)[0] );
      }
      });
      
      $gbwa.on('click.oneclick', '[data-oneclick=enabled]', toggle);
    })();
    }
    else if (tries++ < 10) {
      // probably a better way to do this, but I'm being lazy ATM.
// console.log("trying again");
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
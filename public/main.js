function on(elSelector, eventName, selector, fn) { var element = document.querySelector(elSelector); element.addEventListener(eventName, function (event) { var possibleTargets = element.querySelectorAll(selector); var target = event.target; for (var i = 0, l = possibleTargets.length; i < l; i++) { var el = target; var p = possibleTargets[i]; while (el && el !== element) { if (el === p) { return fn.call(p, event); } el = el.parentNode; } } }); }
    on('body', 'click', '.select-control__menu-item', function () {
      this.parentElement.style.opacity = "0";
      this.parentElement.style.visibility = "hidden";
      this.parentElement.previousElementSibling.classList.remove("active");
    })

    on('body', 'click', '.select-control__main', function () {
      block = this.nextElementSibling;
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        this.style.color = "black";
        this.nextElementSibling.style.opacity = "0";
        this.nextElementSibling.style.visibility = "hidden";
        block.querySelector(".input__search").value = "";
      }
      else {
        this.classList.add("active");
        this.nextElementSibling.style.opacity = "1";
        this.nextElementSibling.style.visibility = "unset";
        this.style.color = "black";
      }
      if (this.parentElement.querySelector(".input__search")) {
        null
      }
      else {
        $input = document.createElement("input");
        $input.classList.add("input__search");
        $input.setAttribute("placeholder", "Search here...");
        block.prepend($input);
        block.style.opacity = "1";
        block.style.visibility = "unset";
      }

      console.log('click');
    });
    on('body', 'input', '.input__search', function () {
      val = this.value;
      blockList = this.parentElement.querySelectorAll(".select-control__menu-item");
      for (var i = 0; i < blockList.length; i++) {
        blockList[i].classList.remove("hidden");
      }
      if (this.value == "") {
        return;
      }

      console.log("search value", val);
      for (var i = 0; i < blockList.length; i++) {
        span = blockList[i].querySelector("span");

        //console.log("span value", span.innerHTML);
        if (!span.innerHTML.includes(val)) {
          blockList[i].classList.add("hidden");
        }
      }
    })
    on('body', 'click', '.input__search', function (e) {
      this.parentElement.previousElementSibling.classList.add("active");
      return
    });

    function openInNewTab(url) {
      window.open(url, '_blank').focus();
    }
    on('body', 'click', '.link_to_conf', function (e) {
      e.preventDefault();
      openInNewTab("https://video.justmediationhub.com/");
    });
    function get_document_opacity_0() {
        document.body.style.overflowY = "hidden";
        //document.body.style.marginRight = "20px";
        overlay = document.body.querySelector(".body_overlay");
        overlay.style.visibility = "unset";
        overlay.style.opacity = "1";
      };
      function get_document_opacity_1() {
        document.body.style.overflowY = "scroll";
        //document.body.style.marginRight = "0";
        overlay = document.body.querySelector(".body_overlay");
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
      };
      function close_fullscreen() {
          container = document.body.querySelector("#fullscreens_container");
          if (!container.innerHTML) {
            get_document_opacity_1();
            return
          };
          container = document.body.querySelector("#fullscreens_container");
          _window = container.querySelector(".card_fullscreen");

          _window.remove();
      };


      function create_fullscreen(url) {
          container = document.body.querySelector("#fullscreens_container");

          try {
            count_items = container.querySelectorAll(".card_fullscreen").length + 1
          } catch { count_items = 0 };

          link = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
          link.open('GET', url, true);
          link.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

          link.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              if (container.innerHTML) {
                prev_window = container.querySelector(".card_fullscreen");
                prev_window.classList.add("hide");
              };

              $parent_div = document.createElement("div");
              $parent_div.classList.add("card_fullscreen", "mb-30", "border");
              $parent_div.style.zIndex = 100 + count_items;
              $parent_div.style.opacity = "0";

              $hide_span = document.createElement("span");
              $hide_span.classList.add("this_fullscreen_hide");
              $loader = document.createElement("div");

              $loader.setAttribute("id", "fullscreen_loader");
              $hide_span.innerHTML = '<svg class="svg_default" style="position:fixed;" width="30" height="30" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
              $parent_div.append($hide_span);
              $parent_div.append($loader);
              container.prepend($parent_div);

              elem = link.responseText;

              $loader.innerHTML = elem;
              height = $loader.scrollHeight * 1 + 30;
              if (height < 500) {
                $parent_div.style.height = height + "px";
                $loader.style.overflowY = "unset";

                _height = (window.innerHeight - height - 50) / 2;
                $parent_div.style.top = _height + "px";
                prev_next_height = _height * 1 + 50 + "px";
              } else {
                $parent_div.style.height = "100%";
                $parent_div.style.top = "15px";
                $loader.style.overflowY = "auto";
              };
              $parent_div.style.opacity = "1";
              if ($loader.querySelector(".data_display")) {
                $loader.style.overflowY = "unset";
              }

              get_document_opacity_0();
            }
          };
          link.send();
        };
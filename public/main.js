function on(elSelector, eventName, selector, fn) {
    var element = document.querySelector(elSelector);
    element.addEventListener(eventName, function(event) {
        var possibleTargets = element.querySelectorAll(selector);
        var target = event.target;
        for (var i = 0, l = possibleTargets.length; i < l; i++) {
            var el = target;
            var p = possibleTargets[i];
            while (el && el !== element) {
                if (el === p) {
                    return fn.call(p, event);
                }
                el = el.parentNode;
            }
        }
    });
}
on('#root', 'click', '.select-control__menu-item', function() {
    this.parentElement.style.opacity = "0";
    this.parentElement.style.visibility = "hidden";
    this.parentElement.previousElementSibling.classList.remove("active");
})

on('#root', 'click', '.select-control__main', function() {
    block = this.nextElementSibling;
    if (this.classList.contains("active")) {
        this.classList.remove("active");
        this.style.color = "black";
        this.nextElementSibling.style.opacity = "0";
        this.nextElementSibling.style.visibility = "hidden";
        block.querySelector(".input__search").value = "";
    } else {
        this.classList.add("active");
        this.nextElementSibling.style.opacity = "1";
        this.nextElementSibling.style.visibility = "unset";
        this.style.color = "black";
    }
    if (this.parentElement.querySelector(".input__search")) {
        null
    } else {
        $input = document.createElement("input");
        $input.classList.add("input__search");
        $input.setAttribute("placeholder", "Search here...");
        block.prepend($input);
        block.style.opacity = "1";
        block.style.visibility = "unset";
    }

    console.log('click');
});
on('#root', 'input', '.input__search', function() {
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
on('#root', 'click', '.input__search', function(e) {
    this.parentElement.previousElementSibling.classList.add("active");
    return
});

function openInNewTab(url) {
    window.open(url, '_blank').focus();
}
on('#root', 'click', '.link_to_conf', function(e) {
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


function create_fullscreen(html) {
    container = document.body.querySelector("#fullscreens_container");

    try {
        count_items = container.querySelectorAll(".card_fullscreen").length + 1
    } catch {
        count_items = 0
    };

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
    $loader.innerHTML = html;
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

    get_document_opacity_0();
};

attorney_reg = '<form class="js_form"></form><div class="create-account-layout"><div class="create-account-layout__content"><div class="my-auto d-flex flex-column form_step_container" data-step="1"><div class="create-account-layout__form mx-auto"><div class="step mb-2">Step 1 of 10</div><div class="title mb-3">Account Registration</div><h3>Basic Information</h3><div class="input-control mt-1"><div class="d-flex justify-content-between align-items-center"><label for="id_first_name" class="input-control__label">First name</label></div><input name="first_name" id="id_first_name" placeholder="Enter your first name" type="text"><div class="input-control__footer"></div></div><div class="col-12 mt-2"><div class="text-dark">Select practice areas you want to follow:</div><div class="row"><div class="col-md-6 test my-1 d-flex justify-content-between practice-area-item"><div class=""><label class="checkbox-component">Corporate Disputes<input type="checkbox"><span></span></label></div></div><div class="col-md-6 test my-1 d-flex justify-content-between practice-area-item"><div class=""><label class="checkbox-component">Intellectual Property<input type="checkbox"><span></span></label></div></div></div></div><div class="signup-bar"><div class="link-button prev_step hidden" data-step="1"><img src="/static/images/arrow-left-green.svg" alt="icon">Go Back</div><button class="btn btn--green ripple-effect normal ml-auto next_step" type="button" data-step="2"><span>Next</span></button></div></div></div><div class="my-auto d-flex flex-column form_step_container hidden" data-step="2"><div class="create-account-layout__form mx-auto"><div class="step mb-2">Step 2 of 10</div><div class="title mb-3">STEP 2: Practice Profile Setup</div><h3>Basic Information</h3><div class="input-control mt-1"><div class="d-flex justify-content-between align-items-center"><label for="id_first_name" class="input-control__label">First name</label></div><input name="first_name" id="id_first_name" placeholder="Enter your first name" type="text"><div class="input-control__footer"></div></div><div class="signup-bar"><div class="link-button prev_step hidden" data-step="2"><img src="/static/images/arrow-left-green.svg" alt="icon">Go Back</div><button class="btn btn--green ripple-effect normal ml-auto next_step" type="button" data-step="3"><span>Next</span></button></div></div></div><div class="login-page__footer mb-3"><span class="mr-1">Already have an account?</span><a class="ajax" href="/">Log in here</a></div></div></form>';
on('#root', 'click', '#attorney_register', function(e) {
    e.preventDefault();
    create_fullscreen(attorney_reg);
});

on('#root', 'click', '.this_fullscreen_hide', function(e) {
    e.preventDefault();
    close_fullscreen();
});
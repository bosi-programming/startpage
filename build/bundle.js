
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Fetch.svelte generated by Svelte v3.16.5 */
    const file = "src/Fetch.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (13:4) {#each sites as site}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t0_value = /*site*/ ctx[4].name + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*site*/ ctx[4].url);
    			attr_dev(a, "target", "_blanks");
    			attr_dev(a, "rel", "noopener");
    			add_location(a, file, 14, 8, 306);
    			add_location(li, file, 13, 6, 293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*sites*/ 2 && t0_value !== (t0_value = /*site*/ ctx[4].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*sites*/ 2 && a_href_value !== (a_href_value = /*site*/ ctx[4].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(13:4) {#each sites as site}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let aside;
    	let h2;
    	let t1;
    	let ul;
    	let each_value = /*sites*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			h2 = element("h2");
    			h2.textContent = `${/*idTitle*/ ctx[2]}`;
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-8dqro8");
    			add_location(h2, file, 10, 2, 235);
    			add_location(ul, file, 11, 2, 256);
    			attr_dev(aside, "id", /*idName*/ ctx[0]);
    			add_location(aside, file, 9, 0, 213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, h2);
    			append_dev(aside, t1);
    			append_dev(aside, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sites*/ 2) {
    				each_value = /*sites*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*idName*/ 1) {
    				attr_dev(aside, "id", /*idName*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { dataFile = "./data/tea.json" } = $$props;
    	let { idName = "tea" } = $$props;
    	let { sites = [] } = $$props;
    	let idTitle = idName[0].toUpperCase() + idName.slice(1);
    	const writable_props = ["dataFile", "idName", "sites"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Fetch> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("dataFile" in $$props) $$invalidate(3, dataFile = $$props.dataFile);
    		if ("idName" in $$props) $$invalidate(0, idName = $$props.idName);
    		if ("sites" in $$props) $$invalidate(1, sites = $$props.sites);
    	};

    	$$self.$capture_state = () => {
    		return { dataFile, idName, sites, idTitle };
    	};

    	$$self.$inject_state = $$props => {
    		if ("dataFile" in $$props) $$invalidate(3, dataFile = $$props.dataFile);
    		if ("idName" in $$props) $$invalidate(0, idName = $$props.idName);
    		if ("sites" in $$props) $$invalidate(1, sites = $$props.sites);
    		if ("idTitle" in $$props) $$invalidate(2, idTitle = $$props.idTitle);
    	};

    	return [idName, sites, idTitle, dataFile];
    }

    class Fetch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { dataFile: 3, idName: 0, sites: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fetch",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get dataFile() {
    		throw new Error("<Fetch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataFile(value) {
    		throw new Error("<Fetch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get idName() {
    		throw new Error("<Fetch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idName(value) {
    		throw new Error("<Fetch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sites() {
    		throw new Error("<Fetch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sites(value) {
    		throw new Error("<Fetch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/MenuCel.svelte generated by Svelte v3.16.5 */

    const file$1 = "src/MenuCel.svelte";

    function create_fragment$1(ctx) {
    	let nav;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let t7;
    	let button4;

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			button0 = element("button");
    			button0.textContent = "Tea";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Study";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "Programming";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "Utilities";
    			t7 = space();
    			button4 = element("button");
    			button4.textContent = "Social";
    			attr_dev(button0, "class", "menu btn btn-nav");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "onclick", "menuCel('#tea')");
    			add_location(button0, file$1, 4, 2, 44);
    			attr_dev(button1, "class", "menu btn btn-nav");
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "onclick", "menuCel('#study')");
    			add_location(button1, file$1, 7, 2, 140);
    			attr_dev(button2, "class", "menu btn btn-nav");
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "onclick", "menuCel('#programming')");
    			add_location(button2, file$1, 10, 2, 240);
    			attr_dev(button3, "class", "menu btn btn-nav");
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "onclick", "menuCel('#utilities')");
    			add_location(button3, file$1, 17, 2, 367);
    			attr_dev(button4, "class", "menu btn btn-nav");
    			attr_dev(button4, "type", "button");
    			attr_dev(button4, "onclick", "menuCel('#social')");
    			add_location(button4, file$1, 24, 2, 490);
    			attr_dev(nav, "class", "menuCel");
    			add_location(nav, file$1, 3, 0, 20);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, button0);
    			append_dev(nav, t1);
    			append_dev(nav, button1);
    			append_dev(nav, t3);
    			append_dev(nav, button2);
    			append_dev(nav, t5);
    			append_dev(nav, button3);
    			append_dev(nav, t7);
    			append_dev(nav, button4);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class MenuCel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuCel",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.5 */
    const file$2 = "src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (11:4) {#each data as menu}
    function create_each_block$1(ctx) {
    	let current;

    	const fetch = new Fetch({
    			props: {
    				sites: /*menu*/ ctx[1],
    				dataFile: "./data/tea.json",
    				idName: "tea"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fetch.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fetch, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fetch.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fetch.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fetch, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(11:4) {#each data as menu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let t0;
    	let main;
    	let div;
    	let t1;
    	let nav;
    	let button;
    	let t3;
    	let footer;
    	let script0;
    	let script0_src_value;
    	let t4;
    	let script1;
    	let script1_src_value;
    	let current;
    	const menucel = new MenuCel({ $$inline: true });
    	let each_value = /*data*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(menucel.$$.fragment);
    			t0 = space();
    			main = element("main");
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			nav = element("nav");
    			button = element("button");
    			button.textContent = "Clear";
    			t3 = space();
    			footer = element("footer");
    			script0 = element("script");
    			t4 = space();
    			script1 = element("script");
    			attr_dev(div, "class", "flex-div__content svelte-j5t9cy");
    			add_location(div, file$2, 9, 2, 201);
    			attr_dev(main, "class", "flex-div svelte-j5t9cy");
    			add_location(main, file$2, 8, 0, 175);
    			attr_dev(button, "class", "clearCel btn btn-nav");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "onclick", "menuClearCel()");
    			add_location(button, file$2, 17, 2, 365);
    			add_location(nav, file$2, 16, 0, 357);
    			if (script0.src !== (script0_src_value = "./js/selectionFunctions.js")) attr_dev(script0, "src", script0_src_value);
    			add_location(script0, file$2, 23, 2, 483);
    			if (script1.src !== (script1_src_value = "./js/cell.js")) attr_dev(script1, "src", script1_src_value);
    			add_location(script1, file$2, 25, 2, 537);
    			add_location(footer, file$2, 22, 0, 472);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menucel, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, nav, anchor);
    			append_dev(nav, button);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, script0);
    			append_dev(footer, t4);
    			append_dev(footer, script1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menucel.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menucel.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menucel, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(nav);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self) {
    	const { data } = JSON.parse(localStorage.getItem("sites"));

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		
    	};

    	return [data];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

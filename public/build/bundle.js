
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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

    const globals = (typeof window !== 'undefined' ? window : global);
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
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

    /* src/components/Column.svelte generated by Svelte v3.16.5 */

    const file$6 = "src/components/Column.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (8:4) {#if column && column.sites}
    function create_if_block$5(ctx) {
    	let each_1_anchor;
    	let each_value = /*column*/ ctx[0].sites;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*column*/ 1) {
    				each_value = /*column*/ ctx[0].sites;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(8:4) {#if column && column.sites}",
    		ctx
    	});

    	return block;
    }

    // (9:6) {#each column.sites as site}
    function create_each_block$3(ctx) {
    	let li;
    	let a;
    	let t0_value = /*site*/ ctx[1].name + "";
    	let t0;
    	let a_href_value;
    	let t1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = /*site*/ ctx[1].url);
    			attr_dev(a, "target", "_self");
    			attr_dev(a, "rel", "noopener");
    			attr_dev(a, "class", "svelte-1eyz1uu");
    			add_location(a, file$6, 10, 10, 196);
    			attr_dev(li, "class", "svelte-1eyz1uu");
    			add_location(li, file$6, 9, 8, 181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*column*/ 1 && t0_value !== (t0_value = /*site*/ ctx[1].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*column*/ 1 && a_href_value !== (a_href_value = /*site*/ ctx[1].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(9:6) {#each column.sites as site}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let aside;
    	let h2;
    	let t0_value = /*column*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let ul;
    	let aside_id_value;
    	let if_block = /*column*/ ctx[0] && /*column*/ ctx[0].sites && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");
    			if (if_block) if_block.c();
    			attr_dev(h2, "class", "svelte-1eyz1uu");
    			add_location(h2, file$6, 5, 2, 74);
    			attr_dev(ul, "class", "svelte-1eyz1uu");
    			add_location(ul, file$6, 6, 2, 100);
    			attr_dev(aside, "id", aside_id_value = /*column*/ ctx[0].title);
    			add_location(aside, file$6, 4, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, h2);
    			append_dev(h2, t0);
    			append_dev(aside, t1);
    			append_dev(aside, ul);
    			if (if_block) if_block.m(ul, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*column*/ 1 && t0_value !== (t0_value = /*column*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (/*column*/ ctx[0] && /*column*/ ctx[0].sites) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*column*/ 1 && aside_id_value !== (aside_id_value = /*column*/ ctx[0].title)) {
    				attr_dev(aside, "id", aside_id_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { column = [] } = $$props;
    	const writable_props = ["column"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Column> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("column" in $$props) $$invalidate(0, column = $$props.column);
    	};

    	$$self.$capture_state = () => {
    		return { column };
    	};

    	$$self.$inject_state = $$props => {
    		if ("column" in $$props) $$invalidate(0, column = $$props.column);
    	};

    	return [column];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { column: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get column() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set column(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Home.svelte generated by Svelte v3.16.5 */
    const file$5 = "src/pages/Home.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (32:0) {:else}
    function create_else_block$2(ctx) {
    	let div;
    	let t0;
    	let button;
    	let current;
    	let dispose;
    	let if_block = /*allMenus*/ ctx[0] && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			button = element("button");
    			button.textContent = "Open Builder";
    			attr_dev(div, "class", "flex-div__content svelte-6d58po");
    			add_location(div, file$5, 32, 2, 835);
    			attr_dev(button, "class", "button svelte-6d58po");
    			add_location(button, file$5, 39, 2, 985);
    			dispose = listen_dev(button, "click", /*handleOpenBuilder*/ ctx[1], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*allMenus*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(32:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if windowWidth < 1024}
    function create_if_block$4(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let button;
    	let current;
    	let dispose;
    	let if_block0 = /*allMenus*/ ctx[0] && /*selectedCelMenu*/ ctx[2] === null && create_if_block_2(ctx);
    	let if_block1 = /*selectedCelMenu*/ ctx[2] !== null && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			button = element("button");
    			button.textContent = "Open Builder";
    			attr_dev(button, "class", "button svelte-6d58po");
    			add_location(button, file$5, 29, 4, 740);
    			attr_dev(div, "class", "flex-div");
    			add_location(div, file$5, 15, 2, 299);
    			dispose = listen_dev(button, "click", /*handleOpenBuilder*/ ctx[1], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			append_dev(div, button);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*allMenus*/ ctx[0] && /*selectedCelMenu*/ ctx[2] === null) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*selectedCelMenu*/ ctx[2] !== null) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(15:0) {#if windowWidth < 1024}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#if allMenus}
    function create_if_block_3(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*allMenus*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allMenus*/ 1) {
    				each_value_1 = /*allMenus*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(34:4) {#if allMenus}",
    		ctx
    	});

    	return block;
    }

    // (35:6) {#each allMenus as menu}
    function create_each_block_1(ctx) {
    	let current;

    	const column = new Column({
    			props: { column: /*menu*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};
    			if (dirty & /*allMenus*/ 1) column_changes.column = /*menu*/ ctx[7];
    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(35:6) {#each allMenus as menu}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#if allMenus && selectedCelMenu === null}
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let each_value = /*allMenus*/ ctx[0];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectCelMenu, allMenus*/ 17) {
    				each_value = /*allMenus*/ ctx[0];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(17:4) {#if allMenus && selectedCelMenu === null}",
    		ctx
    	});

    	return block;
    }

    // (18:6) {#each allMenus as menu, index}
    function create_each_block$2(ctx) {
    	let button;
    	let t0_value = /*menu*/ ctx[7].title + "";
    	let t0;
    	let t1;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*index*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "button svelte-6d58po");
    			add_location(button, file$5, 18, 8, 415);
    			dispose = listen_dev(button, "click", click_handler, false, false, false);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*allMenus*/ 1 && t0_value !== (t0_value = /*menu*/ ctx[7].title + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:6) {#each allMenus as menu, index}",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#if selectedCelMenu !== null}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let button;
    	let current;
    	let dispose;

    	const column = new Column({
    			props: {
    				column: /*allMenus*/ ctx[0][/*selectedCelMenu*/ ctx[2]]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    			t0 = space();
    			button = element("button");
    			button.textContent = "Clear";
    			attr_dev(button, "class", "button svelte-6d58po");
    			add_location(button, file$5, 25, 6, 635);
    			dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[6], false, false, false);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};
    			if (dirty & /*allMenus, selectedCelMenu*/ 5) column_changes.column = /*allMenus*/ ctx[0][/*selectedCelMenu*/ ctx[2]];
    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(24:4) {#if selectedCelMenu !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*windowWidth*/ ctx[3] < 1024) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { allMenus } = $$props;
    	let { handleOpenBuilder } = $$props;
    	const windowWidth = window.innerWidth;
    	let selectedCelMenu = null;

    	const selectCelMenu = index => {
    		$$invalidate(2, selectedCelMenu = index);
    	};

    	const writable_props = ["allMenus", "handleOpenBuilder"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => selectCelMenu(index);
    	const click_handler_1 = () => selectCelMenu(null);

    	$$self.$set = $$props => {
    		if ("allMenus" in $$props) $$invalidate(0, allMenus = $$props.allMenus);
    		if ("handleOpenBuilder" in $$props) $$invalidate(1, handleOpenBuilder = $$props.handleOpenBuilder);
    	};

    	$$self.$capture_state = () => {
    		return {
    			allMenus,
    			handleOpenBuilder,
    			selectedCelMenu
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("allMenus" in $$props) $$invalidate(0, allMenus = $$props.allMenus);
    		if ("handleOpenBuilder" in $$props) $$invalidate(1, handleOpenBuilder = $$props.handleOpenBuilder);
    		if ("selectedCelMenu" in $$props) $$invalidate(2, selectedCelMenu = $$props.selectedCelMenu);
    	};

    	return [
    		allMenus,
    		handleOpenBuilder,
    		selectedCelMenu,
    		windowWidth,
    		selectCelMenu,
    		click_handler,
    		click_handler_1
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { allMenus: 0, handleOpenBuilder: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*allMenus*/ ctx[0] === undefined && !("allMenus" in props)) {
    			console.warn("<Home> was created without expected prop 'allMenus'");
    		}

    		if (/*handleOpenBuilder*/ ctx[1] === undefined && !("handleOpenBuilder" in props)) {
    			console.warn("<Home> was created without expected prop 'handleOpenBuilder'");
    		}
    	}

    	get allMenus() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allMenus(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleOpenBuilder() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleOpenBuilder(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/JsonEditor.svelte generated by Svelte v3.16.5 */

    const file$4 = "src/components/JsonEditor.svelte";

    function create_fragment$4(ctx) {
    	let textarea;
    	let textarea_value_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "cols", /*windowWidth*/ ctx[2] < 1024 ? 30 : 100);
    			attr_dev(textarea, "rows", "30");
    			attr_dev(textarea, "type", "text");
    			textarea.value = textarea_value_value = JSON.stringify(/*allMenus*/ ctx[1], null, 2);
    			add_location(textarea, file$4, 7, 0, 111);
    			dispose = listen_dev(textarea, "change", /*change_handler*/ ctx[3], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*allMenus*/ 2 && textarea_value_value !== (textarea_value_value = JSON.stringify(/*allMenus*/ ctx[1], null, 2))) {
    				prop_dev(textarea, "value", textarea_value_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { updateSites } = $$props;
    	let { allMenus } = $$props;
    	const windowWidth = window.innerWidth;
    	const writable_props = ["updateSites", "allMenus"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<JsonEditor> was created with unknown prop '${key}'`);
    	});

    	const change_handler = event => updateSites(event.target.value);

    	$$self.$set = $$props => {
    		if ("updateSites" in $$props) $$invalidate(0, updateSites = $$props.updateSites);
    		if ("allMenus" in $$props) $$invalidate(1, allMenus = $$props.allMenus);
    	};

    	$$self.$capture_state = () => {
    		return { updateSites, allMenus };
    	};

    	$$self.$inject_state = $$props => {
    		if ("updateSites" in $$props) $$invalidate(0, updateSites = $$props.updateSites);
    		if ("allMenus" in $$props) $$invalidate(1, allMenus = $$props.allMenus);
    	};

    	return [updateSites, allMenus, windowWidth, change_handler];
    }

    class JsonEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { updateSites: 0, allMenus: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JsonEditor",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*updateSites*/ ctx[0] === undefined && !("updateSites" in props)) {
    			console.warn("<JsonEditor> was created without expected prop 'updateSites'");
    		}

    		if (/*allMenus*/ ctx[1] === undefined && !("allMenus" in props)) {
    			console.warn("<JsonEditor> was created without expected prop 'allMenus'");
    		}
    	}

    	get updateSites() {
    		throw new Error("<JsonEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateSites(value) {
    		throw new Error("<JsonEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allMenus() {
    		throw new Error("<JsonEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allMenus(value) {
    		throw new Error("<JsonEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/FormEditor/components/EditColumn.svelte generated by Svelte v3.16.5 */

    const file$3 = "src/components/FormEditor/components/EditColumn.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (29:4) {#if selectedColumn && selectedColumn.sites}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*selectedColumn*/ ctx[0].sites;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedColumn, getNewSites, updateMenu, selectedColumnIndex*/ 15) {
    				each_value = /*selectedColumn*/ ctx[0].sites;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(29:4) {#if selectedColumn && selectedColumn.sites}",
    		ctx
    	});

    	return block;
    }

    // (30:6) {#each selectedColumn.sites as site, siteIndex}
    function create_each_block$1(ctx) {
    	let li;
    	let input0;
    	let input0_value_value;
    	let t0;
    	let input1;
    	let input1_value_value;
    	let t1;
    	let dispose;

    	function change_handler_1(...args) {
    		return /*change_handler_1*/ ctx[5](/*siteIndex*/ ctx[10], ...args);
    	}

    	function change_handler_2(...args) {
    		return /*change_handler_2*/ ctx[6](/*siteIndex*/ ctx[10], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			attr_dev(input0, "type", "url");
    			attr_dev(input0, "placeholder", "URL");
    			input0.value = input0_value_value = /*site*/ ctx[8].url;
    			add_location(input0, file$3, 31, 10, 856);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Site name");
    			input1.value = input1_value_value = /*site*/ ctx[8].name;
    			add_location(input1, file$3, 40, 10, 1159);
    			attr_dev(li, "class", "svelte-1flinyf");
    			add_location(li, file$3, 30, 8, 841);

    			dispose = [
    				listen_dev(input0, "change", change_handler_1, false, false, false),
    				listen_dev(input1, "change", change_handler_2, false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, input0);
    			append_dev(li, t0);
    			append_dev(li, input1);
    			append_dev(li, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*selectedColumn*/ 1 && input0_value_value !== (input0_value_value = /*site*/ ctx[8].url)) {
    				prop_dev(input0, "value", input0_value_value);
    			}

    			if (dirty & /*selectedColumn*/ 1 && input1_value_value !== (input1_value_value = /*site*/ ctx[8].name)) {
    				prop_dev(input1, "value", input1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(30:6) {#each selectedColumn.sites as site, siteIndex}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let aside;
    	let div;
    	let label;
    	let t0;
    	let label_for_value;
    	let t1;
    	let input;
    	let input_value_value;
    	let t2;
    	let ul;
    	let t3;
    	let button;
    	let aside_id_value;
    	let dispose;
    	let if_block = /*selectedColumn*/ ctx[0] && /*selectedColumn*/ ctx[0].sites && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div = element("div");
    			label = element("label");
    			t0 = text("Title");
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			ul = element("ul");
    			if (if_block) if_block.c();
    			t3 = space();
    			button = element("button");
    			button.textContent = "Add new site";
    			attr_dev(label, "for", label_for_value = `title-${/*selectedColumn*/ ctx[0]}`);
    			add_location(label, file$3, 19, 4, 500);
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*selectedColumn*/ ctx[0].title;
    			add_location(input, file$3, 20, 4, 557);
    			attr_dev(div, "class", "field");
    			add_location(div, file$3, 18, 2, 476);
    			attr_dev(ul, "class", "svelte-1flinyf");
    			add_location(ul, file$3, 27, 2, 725);
    			attr_dev(button, "class", "button button-center svelte-1flinyf");
    			attr_dev(button, "type", "button");
    			add_location(button, file$3, 53, 2, 1509);
    			attr_dev(aside, "id", aside_id_value = /*selectedColumn*/ ctx[0].title);
    			attr_dev(aside, "class", "form-editor__content");
    			add_location(aside, file$3, 17, 0, 411);

    			dispose = [
    				listen_dev(input, "change", /*change_handler*/ ctx[4], false, false, false),
    				listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div);
    			append_dev(div, label);
    			append_dev(label, t0);
    			append_dev(div, t1);
    			append_dev(div, input);
    			append_dev(aside, t2);
    			append_dev(aside, ul);
    			if (if_block) if_block.m(ul, null);
    			append_dev(aside, t3);
    			append_dev(aside, button);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selectedColumn*/ 1 && label_for_value !== (label_for_value = `title-${/*selectedColumn*/ ctx[0]}`)) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (dirty & /*selectedColumn*/ 1 && input_value_value !== (input_value_value = /*selectedColumn*/ ctx[0].title)) {
    				prop_dev(input, "value", input_value_value);
    			}

    			if (/*selectedColumn*/ ctx[0] && /*selectedColumn*/ ctx[0].sites) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(ul, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*selectedColumn*/ 1 && aside_id_value !== (aside_id_value = /*selectedColumn*/ ctx[0].title)) {
    				attr_dev(aside, "id", aside_id_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if (if_block) if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { selectedColumn } = $$props;
    	let { selectedColumnIndex } = $$props;
    	let { updateMenu } = $$props;

    	const getNewSites = (newValue, index, field) => {
    		if (!selectedColumn.sites[index]) {
    			$$invalidate(0, selectedColumn.sites[index] = { url: "", name: "" }, selectedColumn);
    		}

    		if (field) {
    			$$invalidate(0, selectedColumn.sites[index][field] = newValue, selectedColumn);
    		}

    		const newSites = selectedColumn.sites;
    		return newSites;
    	};

    	const writable_props = ["selectedColumn", "selectedColumnIndex", "updateMenu"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EditColumn> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => updateMenu(e.target.value, selectedColumnIndex, "title");

    	const change_handler_1 = (siteIndex, e) => {
    		const newSites = getNewSites(e.target.value, siteIndex, "url");
    		updateMenu(newSites, selectedColumnIndex, `sites`);
    	};

    	const change_handler_2 = (siteIndex, e) => {
    		const newSites = getNewSites(e.target.value, siteIndex, "name");
    		updateMenu(newSites, selectedColumnIndex, `sites`);
    	};

    	const click_handler = () => {
    		const newSites = getNewSites("", selectedColumn.sites.length);
    		updateMenu(newSites, selectedColumnIndex, `sites`);
    	};

    	$$self.$set = $$props => {
    		if ("selectedColumn" in $$props) $$invalidate(0, selectedColumn = $$props.selectedColumn);
    		if ("selectedColumnIndex" in $$props) $$invalidate(1, selectedColumnIndex = $$props.selectedColumnIndex);
    		if ("updateMenu" in $$props) $$invalidate(2, updateMenu = $$props.updateMenu);
    	};

    	$$self.$capture_state = () => {
    		return {
    			selectedColumn,
    			selectedColumnIndex,
    			updateMenu
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("selectedColumn" in $$props) $$invalidate(0, selectedColumn = $$props.selectedColumn);
    		if ("selectedColumnIndex" in $$props) $$invalidate(1, selectedColumnIndex = $$props.selectedColumnIndex);
    		if ("updateMenu" in $$props) $$invalidate(2, updateMenu = $$props.updateMenu);
    	};

    	return [
    		selectedColumn,
    		selectedColumnIndex,
    		updateMenu,
    		getNewSites,
    		change_handler,
    		change_handler_1,
    		change_handler_2,
    		click_handler
    	];
    }

    class EditColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			selectedColumn: 0,
    			selectedColumnIndex: 1,
    			updateMenu: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditColumn",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*selectedColumn*/ ctx[0] === undefined && !("selectedColumn" in props)) {
    			console.warn("<EditColumn> was created without expected prop 'selectedColumn'");
    		}

    		if (/*selectedColumnIndex*/ ctx[1] === undefined && !("selectedColumnIndex" in props)) {
    			console.warn("<EditColumn> was created without expected prop 'selectedColumnIndex'");
    		}

    		if (/*updateMenu*/ ctx[2] === undefined && !("updateMenu" in props)) {
    			console.warn("<EditColumn> was created without expected prop 'updateMenu'");
    		}
    	}

    	get selectedColumn() {
    		throw new Error("<EditColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedColumn(value) {
    		throw new Error("<EditColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedColumnIndex() {
    		throw new Error("<EditColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedColumnIndex(value) {
    		throw new Error("<EditColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateMenu() {
    		throw new Error("<EditColumn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateMenu(value) {
    		throw new Error("<EditColumn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/FormEditor/FormEditor.svelte generated by Svelte v3.16.5 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/components/FormEditor/FormEditor.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (36:4) {#if newSites}
    function create_if_block_1(ctx) {
    	let each_1_anchor;
    	let each_value = /*newSites*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newSites*/ 2) {
    				each_value = /*newSites*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(36:4) {#if newSites}",
    		ctx
    	});

    	return block;
    }

    // (37:6) {#each newSites as column, index}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*column*/ ctx[6].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*index*/ ctx[8];
    			option.value = option.__value;
    			add_location(option, file$2, 37, 8, 1006);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newSites*/ 2 && t_value !== (t_value = /*column*/ ctx[6].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(37:6) {#each newSites as column, index}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {#if newSites && newSites[selectedColumn]}
    function create_if_block$2(ctx) {
    	let current;

    	const editcolumn = new EditColumn({
    			props: {
    				selectedColumnIndex: /*selectedColumn*/ ctx[0],
    				selectedColumn: /*newSites*/ ctx[1][/*selectedColumn*/ ctx[0]],
    				updateMenu: /*updateMenu*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(editcolumn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editcolumn, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const editcolumn_changes = {};
    			if (dirty & /*selectedColumn*/ 1) editcolumn_changes.selectedColumnIndex = /*selectedColumn*/ ctx[0];
    			if (dirty & /*newSites, selectedColumn*/ 3) editcolumn_changes.selectedColumn = /*newSites*/ ctx[1][/*selectedColumn*/ ctx[0]];
    			editcolumn.$set(editcolumn_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editcolumn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editcolumn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editcolumn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(43:2) {#if newSites && newSites[selectedColumn]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let label;
    	let t1;
    	let select;
    	let option0;
    	let option1;
    	let t4;
    	let current;
    	let dispose;
    	let if_block0 = /*newSites*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*newSites*/ ctx[1] && /*newSites*/ ctx[1][/*selectedColumn*/ ctx[0]] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			label = element("label");
    			label.textContent = "Choose the column you want to edit:";
    			t1 = space();
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Select an option";
    			if (if_block0) if_block0.c();
    			option1 = element("option");
    			option1.textContent = "Add new column";
    			t4 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(label, "for", "column");
    			add_location(label, file$2, 20, 2, 473);
    			option0.__value = null;
    			option0.value = option0.__value;
    			option0.hidden = true;
    			option0.selected = true;
    			option0.disabled = true;
    			add_location(option0, file$2, 34, 4, 867);
    			option1.__value = "new";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 40, 4, 1080);
    			attr_dev(select, "name", "sites");
    			attr_dev(select, "id", "sites");
    			add_location(select, file$2, 21, 2, 539);
    			attr_dev(main, "class", "flex-div");
    			add_location(main, file$2, 19, 0, 447);

    			dispose = listen_dev(
    				select,
    				"change",
    				function () {
    					/*change_handler*/ ctx[5].apply(this, arguments);
    				},
    				false,
    				false,
    				false
    			);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, label);
    			append_dev(main, t1);
    			append_dev(main, select);
    			append_dev(select, option0);
    			if (if_block0) if_block0.m(select, null);
    			append_dev(select, option1);
    			append_dev(main, t4);
    			if (if_block1) if_block1.m(main, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (/*newSites*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(select, option1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*newSites*/ ctx[1] && /*newSites*/ ctx[1][/*selectedColumn*/ ctx[0]]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { updateSites } = $$props;
    	let { allMenus } = $$props;
    	let selectedColumn = 0;
    	console.log(selectedColumn);
    	let newSites = allMenus || [];

    	const updateMenu = (newValue, index, field) => {
    		if (!newSites[index]) {
    			$$invalidate(1, newSites[index] = {}, newSites);
    		}

    		$$invalidate(1, newSites[index][field] = newValue, newSites);
    		updateSites(JSON.stringify(newSites));
    		console.log(newSites);
    	};

    	const writable_props = ["updateSites", "allMenus"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<FormEditor> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => {
    		const value = e.target.value;

    		if (value === "new" && newSites) {
    			updateMenu(e.target.value, newSites.length, "title");
    			$$invalidate(0, selectedColumn = newSites.length - 1);
    		} else {
    			$$invalidate(0, selectedColumn = e.target.value);
    		}
    	};

    	$$self.$set = $$props => {
    		if ("updateSites" in $$props) $$invalidate(3, updateSites = $$props.updateSites);
    		if ("allMenus" in $$props) $$invalidate(4, allMenus = $$props.allMenus);
    	};

    	$$self.$capture_state = () => {
    		return {
    			updateSites,
    			allMenus,
    			selectedColumn,
    			newSites
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("updateSites" in $$props) $$invalidate(3, updateSites = $$props.updateSites);
    		if ("allMenus" in $$props) $$invalidate(4, allMenus = $$props.allMenus);
    		if ("selectedColumn" in $$props) $$invalidate(0, selectedColumn = $$props.selectedColumn);
    		if ("newSites" in $$props) $$invalidate(1, newSites = $$props.newSites);
    	};

    	return [selectedColumn, newSites, updateMenu, updateSites, allMenus, change_handler];
    }

    class FormEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { updateSites: 3, allMenus: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FormEditor",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*updateSites*/ ctx[3] === undefined && !("updateSites" in props)) {
    			console_1$1.warn("<FormEditor> was created without expected prop 'updateSites'");
    		}

    		if (/*allMenus*/ ctx[4] === undefined && !("allMenus" in props)) {
    			console_1$1.warn("<FormEditor> was created without expected prop 'allMenus'");
    		}
    	}

    	get updateSites() {
    		throw new Error("<FormEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateSites(value) {
    		throw new Error("<FormEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get allMenus() {
    		throw new Error("<FormEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allMenus(value) {
    		throw new Error("<FormEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var FileSaver_min = createCommonjsModule(function (module, exports) {
    (function(a,b){b();})(commonjsGlobal,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});


    });

    function saveSites() {
      const sites = localStorage.getItem("sites");
      var blob = new Blob([sites], {
        type: "text/plain;charset=utf-8",
      });
      FileSaver_min.saveAs(blob, "sites.json");
    }

    const exportFileToLocalStorage = (event, localStorageLocation) => {
      const file = event.srcElement.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const newMenus = event.target.result;
        localStorage.removeItem(localStorageLocation);
        localStorage.setItem(localStorageLocation, newMenus);
      });
      reader.readAsText(file);
    };

    /* src/pages/Editor.svelte generated by Svelte v3.16.5 */

    const { console: console_1 } = globals;
    const file$1 = "src/pages/Editor.svelte";

    // (41:0) {:else}
    function create_else_block$1(ctx) {
    	let current;

    	const jsoneditor = new JsonEditor({
    			props: {
    				allMenus: /*allMenus*/ ctx[0],
    				updateSites: /*updateSites*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(jsoneditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(jsoneditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const jsoneditor_changes = {};
    			if (dirty & /*allMenus*/ 1) jsoneditor_changes.allMenus = /*allMenus*/ ctx[0];
    			jsoneditor.$set(jsoneditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jsoneditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jsoneditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(jsoneditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(41:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:0) {#if selectedBuilder === 'form'}
    function create_if_block$1(ctx) {
    	let current;

    	const formeditor = new FormEditor({
    			props: {
    				allMenus: /*allMenus*/ ctx[0],
    				updateSites: /*updateSites*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(formeditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(formeditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const formeditor_changes = {};
    			if (dirty & /*allMenus*/ 1) formeditor_changes.allMenus = /*allMenus*/ ctx[0];
    			formeditor.$set(formeditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(formeditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(formeditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(formeditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(39:0) {#if selectedBuilder === 'form'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h1;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let button0;
    	let t4;
    	let div0;
    	let button1;
    	let t6;
    	let button2;
    	let t7_value = (/*selectedBuilder*/ ctx[2] === "form" ? "JSON" : "Form") + "";
    	let t7;
    	let t8;
    	let t9;
    	let div1;
    	let button3;
    	let t11;
    	let input;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedBuilder*/ ctx[2] === "form") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Personalize your startpage";
    			t1 = space();
    			if_block.c();
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Submit";
    			t4 = space();
    			div0 = element("div");
    			button1 = element("button");
    			button1.textContent = "Close Builder";
    			t6 = space();
    			button2 = element("button");
    			t7 = text(t7_value);
    			t8 = text(" Builder");
    			t9 = space();
    			div1 = element("div");
    			button3 = element("button");
    			button3.textContent = "Export sites";
    			t11 = space();
    			input = element("input");
    			add_location(h1, file$1, 37, 0, 930);
    			attr_dev(button0, "class", "button button-center svelte-18omn71");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$1, 43, 0, 1097);
    			attr_dev(button1, "class", "button svelte-18omn71");
    			add_location(button1, file$1, 51, 2, 1233);
    			attr_dev(button2, "class", "button svelte-18omn71");
    			add_location(button2, file$1, 52, 2, 1312);
    			add_location(div0, file$1, 50, 0, 1225);
    			attr_dev(button3, "class", "button svelte-18omn71");
    			add_location(button3, file$1, 57, 2, 1462);
    			attr_dev(input, "class", "button svelte-18omn71");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "id", "import");
    			attr_dev(input, "accept", ".json");
    			add_location(input, file$1, 60, 2, 1553);
    			add_location(div1, file$1, 56, 0, 1454);

    			dispose = [
    				listen_dev(button0, "click", prevent_default(/*pushSitesToLocalStorage*/ ctx[3]), false, true, false),
    				listen_dev(button1, "click", /*handleOpenBuilder*/ ctx[1], false, false, false),
    				listen_dev(button2, "click", prevent_default(/*changeBuilder*/ ctx[6]), false, true, false),
    				listen_dev(button3, "click", prevent_default(saveSites), false, true, false),
    				listen_dev(input, "change", /*pushFileToLocalStorage*/ ctx[4], false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button1);
    			append_dev(div0, t6);
    			append_dev(div0, button2);
    			append_dev(button2, t7);
    			append_dev(button2, t8);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button3);
    			append_dev(div1, t11);
    			append_dev(div1, input);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(t2.parentNode, t2);
    			}

    			if ((!current || dirty & /*selectedBuilder*/ 4) && t7_value !== (t7_value = (/*selectedBuilder*/ ctx[2] === "form" ? "JSON" : "Form") + "")) set_data_dev(t7, t7_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let { allMenus } = $$props;
    	let { handleOpenBuilder } = $$props;
    	let newSites;
    	let selectedBuilder = "form";

    	const pushSitesToLocalStorage = e => {
    		console.log(e.target.value, newSites);
    		localStorage.removeItem("sites");
    		localStorage.setItem("sites", newSites);
    		handleOpenBuilder();
    	};

    	const pushFileToLocalStorage = e => {
    		exportFileToLocalStorage(e, "sites");
    		location.reload();
    	};

    	const updateSites = newValue => {
    		newSites = newValue;
    	};

    	const changeBuilder = () => {
    		if (selectedBuilder === "form") {
    			$$invalidate(2, selectedBuilder = "json");
    		} else {
    			$$invalidate(2, selectedBuilder = "form");
    		}
    	};

    	const writable_props = ["allMenus", "handleOpenBuilder"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("allMenus" in $$props) $$invalidate(0, allMenus = $$props.allMenus);
    		if ("handleOpenBuilder" in $$props) $$invalidate(1, handleOpenBuilder = $$props.handleOpenBuilder);
    	};

    	$$self.$capture_state = () => {
    		return {
    			allMenus,
    			handleOpenBuilder,
    			newSites,
    			selectedBuilder
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("allMenus" in $$props) $$invalidate(0, allMenus = $$props.allMenus);
    		if ("handleOpenBuilder" in $$props) $$invalidate(1, handleOpenBuilder = $$props.handleOpenBuilder);
    		if ("newSites" in $$props) newSites = $$props.newSites;
    		if ("selectedBuilder" in $$props) $$invalidate(2, selectedBuilder = $$props.selectedBuilder);
    	};

    	return [
    		allMenus,
    		handleOpenBuilder,
    		selectedBuilder,
    		pushSitesToLocalStorage,
    		pushFileToLocalStorage,
    		updateSites,
    		changeBuilder
    	];
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { allMenus: 0, handleOpenBuilder: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editor",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*allMenus*/ ctx[0] === undefined && !("allMenus" in props)) {
    			console_1.warn("<Editor> was created without expected prop 'allMenus'");
    		}

    		if (/*handleOpenBuilder*/ ctx[1] === undefined && !("handleOpenBuilder" in props)) {
    			console_1.warn("<Editor> was created without expected prop 'handleOpenBuilder'");
    		}
    	}

    	get allMenus() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set allMenus(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleOpenBuilder() {
    		throw new Error("<Editor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleOpenBuilder(value) {
    		throw new Error("<Editor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const getFromLocalStorage = (localStorageName) => {
      const localStorageItem = localStorage.getItem(localStorageName);
      if (localStorageItem && localStorageItem !== 'undefined') {
        return JSON.parse(localStorageItem);
      }
      return;
    };

    /* src/App.svelte generated by Svelte v3.16.5 */
    const file = "src/App.svelte";

    // (20:2) {:else}
    function create_else_block(ctx) {
    	let current;

    	const home = new Home({
    			props: {
    				allMenus: /*allMenus*/ ctx[0],
    				handleOpenBuilder: /*handleOpenBuilder*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const home_changes = {};
    			if (dirty & /*allMenus*/ 1) home_changes.allMenus = /*allMenus*/ ctx[0];
    			home.$set(home_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(20:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if isBuilderOpen}
    function create_if_block(ctx) {
    	let form;
    	let current;

    	const editor = new Editor({
    			props: {
    				allMenus: /*allMenus*/ ctx[0],
    				handleOpenBuilder: /*handleOpenBuilder*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			create_component(editor.$$.fragment);
    			attr_dev(form, "class", "flex-div");
    			add_location(form, file, 16, 4, 435);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			mount_component(editor, form, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const editor_changes = {};
    			if (dirty & /*allMenus*/ 1) editor_changes.allMenus = /*allMenus*/ ctx[0];
    			editor.$set(editor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(editor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:2) {#if isBuilderOpen}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isBuilderOpen*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "flex-div");
    			add_location(main, file, 14, 0, 385);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
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
    	let allMenus = getFromLocalStorage("sites") || null;
    	let isBuilderOpen = false;

    	const handleOpenBuilder = () => {
    		$$invalidate(1, isBuilderOpen = !isBuilderOpen);
    		$$invalidate(0, allMenus = getFromLocalStorage("sites"));
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("allMenus" in $$props) $$invalidate(0, allMenus = $$props.allMenus);
    		if ("isBuilderOpen" in $$props) $$invalidate(1, isBuilderOpen = $$props.isBuilderOpen);
    	};

    	return [allMenus, isBuilderOpen, handleOpenBuilder];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

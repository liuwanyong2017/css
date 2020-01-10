const expect = chai.expect;

import Vue from "vue";

import Row from "../src/grid/row.vue";
import Col from "../src/grid/col.vue";

Vue.config.devtools = false;
Vue.config.productionTip = false;

const Constructor1 = Vue.extend(Row);
const Constructor2 = Vue.extend(Col);
const init = (props, Constructor, fix) => {
    const div = document.createElement("div");
    document.body.appendChild(div);
    const vm = new Constructor({propsData: props});
    if (fix) {
        const col1 = new Constructor2().$mount();
        const col2 = new Constructor2().$mount();
        vm.$children = [col1, col2];
    }
    vm.$mount(div);
    vm.getEl = key => vm.$el.querySelector(key);
    vm.getAllEl = key => vm.$el.querySelectorAll(key);
    vm.over = () => {
        vm.$el.remove();
        vm.$destroy();
        div.remove();
    };
    return vm;
};

describe(
    "Row", () => {
        it("存在！", function () {
            expect(Row).to.exist;
        });
        it("gutter属性，可以设置自身的margin值。并且可以把值传递给子组件的gutter属性",
            function () {
                const row = init(
                    {gutter: 20}, Constructor1, true
                );
                const dom = row.$el;
                const children = row.$children;
                children.map(
                    child => {
                        // console.log(child.gutter);
                        expect(child.gutter).to.eq(20);
                    }
                );
                const {marginLeft, marginRight} = getComputedStyle(dom);
                expect(marginLeft).to.eq("-10px");
                expect(marginRight).to.eq("-10px");

                row.over();
            }
        );
        it("可以设置flex的justify-content属性值为left,right,center!", function () {
            const obj = {
                row0: "", row1: "", row2: ""
            };
            ["left", "right", "center"].map(
                (val, ind) => {
                    obj["row" + ind] = init(
                        {justify: val}, Constructor1
                    );
                }
            );
            ["flex-start", "flex-end", "center"].map(
                (val, ind) => {
                    const vm = obj["row" + ind];
                    const div = vm.$el;
                    // console.log(div,div.getAttribute('justify-content'));
                    expect(getComputedStyle(div).justifyContent).to.eq(val);
                    vm.over();
                }
            );
        });
        it("可以设置flex的align-items属性值为up,down,center!", function () {
            const obj = {
                row0: "", row1: "", row2: ""
            };
            ["up", "down", "center"].map(
                (val, ind) => {
                    obj["row" + ind] = init(
                        {align: val}, Constructor1
                    );
                }
            );
            ["flex-start", "flex-end", "center"].map(
                (val, ind) => {
                    const vm = obj["row" + ind];
                    const div = vm.$el;
                    // console.log(div,div.getAttribute('justify-content'));
                    expect(getComputedStyle(div).alignItems).to.eq(val);
                    vm.over();
                }
            );
        });
    }
);
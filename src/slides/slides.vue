<template>
    <div class="yv-slides">
        <div class="yv-slides-window"
             @mouseenter="onmouseenter"
             @mouseleave="onmouseleave"
             @touchstart="ontouchstart"
             @touchend="ontouchend"
        >
            <div class="yv-slides-wrapper">
                <slot></slot>
            </div>
        </div>
        <div class="yv-slides-dots" v-if="length">
                <span @click="clickPre" ref="pre">
                    <y-icon icon="left"></y-icon>
                </span>
            <span v-for="ind in length"
                  :class="active(ind)"
                  :key="ind"
                  @click="toSelect(ind)"
                  ref="dots"
            >
                    {{ind}}
                </span>
            <span @click="clickNext" ref="next">
                    <y-icon icon="right"></y-icon>
                </span>
        </div>
    </div>
</template>
<script>
    import YIcon from "../svg/svg.vue";

    export default {
        name: "slides-v",
        components: {YIcon},
        props: {
            selected: {
                type: Number,
                required: true,
            },
            autoplay: {
                type: Boolean,
                default: true
            },
            reverse: {
                type: Boolean,
                default: false
            },
            delay:{
                type:Number,
                default:3000
            }
        },
        data() {
            return {
                length: undefined,
                timer: undefined,
                touchstart: undefined
            };
        },
        mounted() {
            this.length = this.$children.filter(
                vm => vm.$options.name === "slides-item-v"
            ).length;
            const {reverse, selected} = this;
            this.updateSelected({reverse, selected});
            setTimeout(
                () => {
                    this.updateSelected({init: false});  //初始化第一张图片不需要动画的。
                    this.autoplay && this.autoplayFn(true);
                }, 0
            );
        },
        updated() {
            // console.log(this.selected, "up");
            this.updateSelected({selected: this.selected});
        },
        methods: {
            updateSelected(obj) {
                this.$children.forEach(
                    vm => {
                        Object.keys(obj).map(
                            key => {
                                vm[key] = obj[key];
                            }
                        );
                    }
                );
            },
            getNextSelected(reverse1) {
                const {length, selected, reverse} = this;
                const reverseVal = reverse1 !== undefined ? reverse1 : reverse;
                if (reverseVal) {
                    return selected === 0 ? length - 1 : selected - 1;
                }
                return selected === length - 1 ? 0 : selected + 1;
            },
            autoplayFn(reverseNoNeedUpdate) {
                const {timer} = this;
                const run = () => {
                    this.timer = setTimeout(
                        () => {
                            (!timer && !reverseNoNeedUpdate) &&
                            this.updateSelected({reverse: this.reverse});
                            this.$emit("update:selected", this.getNextSelected());
                            run();
                        }, this.delay
                    );
                };
                run();
            },
            active(ind) {
                return ind - 1 === this.selected ? "active" : "";
            },
            stop() {
                this.timer && clearTimeout(this.timer);
                this.timer = undefined;
            },
            nextUpdate(reverse, selected) {
                // console.log(reverse, "2");
                this.updateSelected({reverse});
                this.$emit("update:selected", selected);
            },
            toSelect(ind) {
                this.stop();
                const {selected} = this;
                if (ind - 1 === selected) return;
                const reverse = ind - 1 < selected;
                // console.log(reverse, "re");
                this.nextUpdate(reverse, ind - 1);
            },
            onmouseenter() {
                this.stop();
            },
            onmouseleave() {
                this.autoplayFn();
            },
            ontouchstart(e) {
                this.stop();
                const {clientX, clientY} = e.touches[0];
                this.touchstart = {clientX, clientY};
                // console.log(e.touches[0]);
            },
            ontouchend(e) {
                const {clientX, clientY} = e.changedTouches[0];
                const test = Math.abs(
                    (this.touchstart.clientY - clientY) / (this.touchstart.clientX - clientX)
                ) < 0.58;
                if (test) {
                    const reverse = clientX - this.touchstart.clientX > 0;  //向左，等同于false
                    // console.log(reverse, "1");
                    this.nextUpdate(reverse, this.getNextSelected(reverse));
                }
                this.onmouseleave();
            },
            clickPre() {
                this.stop();
                this.nextUpdate(true, this.getNextSelected(true));
            },
            clickNext() {
                this.stop();
                this.nextUpdate(false, this.getNextSelected(false));
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../common";
    .yv-slides {
        position: relative;

        &-window {
            overflow: hidden;
        }

        &-wrapper {
            position: relative;
        }

        &-dots {
            position: absolute;
            width: 100%;
            bottom: 0;
            height: 3em;
            display: flex;
            justify-content: center;
            align-items: center;

            & > span {
                margin: 0 4px;
                cursor: pointer;
                display: inline-flex;
                width: 1.3em;height: 1.3em;
                background: #000000;
                color: white;
                opacity: .6;
                justify-content: center;
                align-items: center;
                border-radius: 50%;
                z-index: 1;

                > svg {
                    fill: white;
                }

                &:hover {
                    color: #000;
                    background: white;

                    > svg {
                        fill: #000;
                    }
                }

                &.active {
                    color: $warn-color;

                    &:hover {
                        cursor: default;
                    }
                }
            }
        }
    }
</style>
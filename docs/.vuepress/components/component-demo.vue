<template>
    <div style="margin:1em;">
        <h3>component </h3>
        <h4>组件通讯</h4>
        <p>props，$emit ,自定义事件</p>
        <div>
            <p>自定义事件对组件属性的修改，以及视图的更新test:{{event}}</p>
            <p>
                <input type="text" v-model="message">
                <button @click="add">add</button>
            </p>

            <ul>
                <List v-for="(item,index) in lists"
                      :data="item"
                      :key="item.id" :index="index"
                      @onDelete="onDelete"
                ></List>
            </ul>
        </div>
        <div>
            <h4>event 自定义事件 code</h4>
            <code>
                `import Vue from "vue";

                export default new Vue();
                //自定义事件！`
            </code>
        </div>
        <div>
            <h4>List Component code</h4>
            <pre>
                <code>
                    {{listCode}}
                </code>
            </pre>
        </div>
        <p>
            自定义事件相当于一个window的人设，公共平台，可以接收和分发各种信息！不论嵌套多少层级。
            props,$emit是最基本父子组件通信的手段，当层级深了，可以用自定义事件来进行父子组件间的通讯。
            如果自定义事件的event只关注于数据层面，自身的data里面进行数据存储，其实就是单向数据流的状态管理了。
        </p>
        <pre>
            <code>{{content}}</code>
        </pre>
    </div>
</template>

<script>

    import List from "./component/list";
    import event from "./component/event";
    import getCode from "../../helper-code";
    export default {
        components: {
            List,
        },
        data() {
            return {
                message: "",
                content: '',

                lists: [
                    {message: "title", id: 1}
                ],
                count: 2,
                event: null,
                listCode:'',
            };
        },
        mounted() {
            this.onDeleteCallback = (index) => {
                this.event = "用自定义事件，进行组件间的消息通信：onDelete index=" + `${index}`;
            };
            event.$on("onDelete", this.onDeleteCallback);
            this.onAddCallback = (message) => {
                this.event = "用自定义事件，进行组件间的消息通信：onAdd message=" + `${message}`;
            };
            event.$on("onAdd", this.onAddCallback);
            this.listCode = getCode("lists-rendering-demo.vue").default;
            this.content = getCode('component-demo.vue').default;
        },
        methods: {
            add() {
                const {message} = this;
                if (!message) return;
                event.$emit("onAdd", message);
                this.lists.push({message, id: this.count});
                this.count += 1;
                this.message = "";
            },
            onDelete(index) {
                this.lists.splice(index, 1);
            }
        },
        beforeDestroy() {
            event.$off(
                "onDelete", this.onDeleteCallback
            );
            event.$off(
                "onAdd", this.onAddCallback
            );
        }
    };
</script>

<style>

</style>


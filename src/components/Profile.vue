<template>
  <h1>Profile Form</h1>
  <div class="myform" v-if="data">
    <json-forms
      :data="data"
      :renderers="renderers"
      :schema="schema"
      :uischema="uischema"
      @change="onChange"
    />
    <div class="error" v-if="errorMessage">{{ errorMessage }}</div>
    <kbutton :theme-color="'primary'" v-if="isLegalAge" data-testid="nextButton">Next</kbutton>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import _ from 'lodash';
import { defineComponent } from "vue";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import { Button } from '@progress/kendo-vue-buttons';
import { Input } from '@progress/kendo-vue-inputs';
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";

const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

const renderers = [
  ...vanillaRenderers,
];

interface Element {
  type: string,
  scope: string,
}

const initialValue = {
  firstName: '',
  lastName: '',
  birthday: '',
  email: '',
}

export default defineComponent({
  name: "App",
  components: {
    JsonForms,
    'kbutton': Button,
  },
  data() {
    return {
      // freeze renderers for performance gains
      renderers: Object.freeze(renderers),
      data: initialValue,
      schema: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          birthday: {
            type: "string",
            format: "date",
          },
          email: {
            type: "string",
          },
        },
      },
      uischema: {
        type: "VerticalLayout",
        elements: [
          {
            type: "Control",
            scope: "#/properties/firstName",
          },
          {
            type: "Control",
            scope: "#/properties/lastName",
          },
          {
            type: "Control",
            scope: "#/properties/birthday",
          },
        ],
      },
      isLegalAge: false,
      hasEmail: false,
      errorMessage: '',
    };
  },
  mounted() {
    this.insertKendoClass();
  },
  methods: {
    onChange(event: JsonFormsChangeEvent) {
      this.data = _.get(event, 'data', initialValue);
    },
    validateEmail(value: string) {
      console.log('check');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? null : "Invalid email format";
    },
    removeEmail() {
      const uischemaWithoutEmail = this.uischema.elements.filter((ui: Element) => ui.scope !== '#/properties/email');
      this.uischema.elements = uischemaWithoutEmail;
    },
    showEmail() {
      console.log('show');
      this.uischema.elements.push({
        type: "Control",
        scope: "#/properties/email",
      })
    },
    isValidDate(dateString: string, format: string) {
      return moment(dateString, format, true).isValid();
    },
    isAgeAbove18(birthday: string) {
      const birthdate = moment(birthday);
      const today = moment();
      const age: number = today.diff(birthdate, 'years');
    
      return age >= 18;
    },
    insertKendoClass() {
      console.log('insert');
      const element = document.querySelectorAll('.input');
      _.forEach((element), (el: any) => {
        el.classList.add('k-textbox')
        el.classList.add('k-input')
        el.classList.add('k-input-md')
        el.classList.add('k-input-solid')
        el.classList.add('k-rounded-md')
        el.classList.add('k-rounded-md')
        el.classList.add('text-width')
      })
    },
    insertEmailClass() {
      const email = document.querySelector('input');
      email.classList.add('k-textbox')
      email.classList.add('k-input')
      email.classList.add('k-input-md')
      email.classList.add('k-input-solid')
      email.classList.add('k-rounded-md')
      email.classList.add('k-rounded-md')
      email.classList.add('text-width')
    }
  },
  watch: {
    async data(form) {
      // validate date
      const format = 'YYYY-MM-DD';
      if (this.isValidDate(form.birthday, format) && this.isAgeAbove18(form.birthday)) {
        if(!this.hasEmail) {
          this.showEmail();
        }
        this.insertEmailClass();
        this.hasEmail = true;
        this.isLegalAge = true;
      } else if(this.isValidDate(form.birthday, format)) {
        this.removeEmail();
        this.hasEmail = false;
        this.isLegalAge = false;
      } else {
        console.log('Age is invalid');
      }
      await this.$nextTick();
      this.insertKendoClass();
      if(this.hasEmail && form.email.length > 3) this.errorMessage = this.validateEmail(form.email); 
    }
  },
  provide() {
    return {
      styles: myStyles,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: 120px;
  margin-right: 120px;
}

.mylabel {
  margin: 15px;
}

.vertical-layout {
  margin-left: 10px;
  margin-right: 10px;
}

.myform {
  width: 340px;
  margin: 0 auto;
}

.text-area {
  min-height: 80px;
}

.error {
  color: #FF0010;
}

</style>
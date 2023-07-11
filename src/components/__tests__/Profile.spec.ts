import { describe, it, expect } from 'vitest'

import { mount, shallowMount } from '@vue/test-utils'
import Profile from '../Profile.vue'
import {
  defaultStyles,
  mergeStyles,
  vanillaRenderers,
} from "@jsonforms/vue-vanilla";

describe('Profile', () => {
  it('renders properly', async () => {
    const renderersx = [
      ...vanillaRenderers,
      // here you can add custom renderers
    ];

    const renderers = Object.freeze(renderersx);
    const schema = {
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
    };
    const uischema = {
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
    };
    const wrapper = mount(Profile, {
      data() {
        return {
          renderers,
          schema,
          uischema,
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
  it('input should not exist', () => {
    const wrapper = shallowMount(Profile);
    expect(wrapper.exists()).toBe(true);
    const nextButton = wrapper.findComponent('[data-testid="nextButton"]');
    expect(nextButton.exists()).toBe(false);
  });
})

<template>
  <form @submit.prevent="validateForm" class="space-y-6">
    <slot></slot>
    <div class="flex justify-end">
      <button type="submit" class="btn btn-primary">提交</button>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  name: "cusForm",
  props: {
    rules: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const validateForm = () => {
      let isValid = true;
      const validationResult = {};

      for (const field in props.rules) {
        const rules = props.rules[field];
        const value = ref(null);

        for (const rule of rules) {
          if (!rule.validator(value.value)) {
            validationResult[field] = rule.message;
            isValid = false;
            break;
          }
        }
      }

      emit("validate", { isValid, validationResult });
    };

    return { validateForm };
  }
};
</script>

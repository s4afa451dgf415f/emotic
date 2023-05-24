
import { Loading } from 'element-ui';

let loadingCount = 0;
let loading;

const startLoading = () => {
  let main = document.querySelector('.zw_main')
  loading = Loading.service({
    target:main,
    text: '正在加载',
    customClass: 'zw_loding_main',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0)'
  });
};

const endLoading = () => {
  loading.close();
};

export const showLoading = () => {
  if (loadingCount === 0) {
    startLoading();
  }
  loadingCount += 1;
};

export const hideLoading = () => {
  if (loadingCount <= 0) {
    return;
  }
  loadingCount -= 1;
  if (loadingCount === 0) {
    endLoading();
  }
}
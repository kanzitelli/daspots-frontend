// @flow

const randomTinColor = () => {
  const flat_colors = ['#D24D57', '#5D3F6A', '#8E44AD', '#317589', '#F5AB35', '#6B9362'];

  return flat_colors[ Math.floor(Math.random() * flat_colors.length) ];
}

export default {
  randomTinColor,
}

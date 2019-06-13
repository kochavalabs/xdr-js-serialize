export default {
  calculatePadding: (length) => {
    switch (length % 4) {
      case 1:
        return 3
      case 2:
        return 2
      case 3:
        return 1
      default:
        return 0
    }
  }
}

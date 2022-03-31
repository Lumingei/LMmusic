export function stringToNodes(string, value) {
  const res = []
  for (let key of string) {
    const nodes = []
    if (key.toLowerCase().startsWith(value.toLowerCase())) {
      const key1 =key.slice(0, value.length)
      const key2 =key.slice(value.length)

      const node1 = {
        name: 'span',
        attrs: { style: "color: #4db8ee" },
        children: [{ type: "text", text: key1 }]
      }
      const node2 = {
        name: 'span',
        attrs: { style: "color: black" },
        children: [{ type: "text", text: key2 }]
      }
      nodes.push(node1, node2)
    } else {
      const node = {
        name: 'span',
        attrs: { style: "color: black" },
        children: [{ type: "text", text: key}]
      }
      nodes.push(node)
    }
    res.push(nodes)
  }
  return res
}
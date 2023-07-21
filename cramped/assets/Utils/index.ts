import { _decorator, Component, Layers, Node, UITransform } from 'cc';

/**
 * 生成UI节点
 * @returns 
 */
export const createUINode = () => {
    const node = new Node()
    const transform = node.addComponent(UITransform)
    transform.setAnchorPoint(0,1)
    node.layer = Layers.Enum.UI_2D

    return node
}
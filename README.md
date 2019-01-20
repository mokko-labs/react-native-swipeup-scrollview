## React Native SwipeUp ScrollView

A very cool scrollview that reproduces the iOS Stocks App popup view.

#### Inspiration

<img src="./stocks-app-screenshot.jpeg" width="250" alt="iOS Stocks App" />

It can also be seen in Apple Maps and other stock iOS apps.

#### Props

| Prop  |               Default               |  Type   | Description                                                                                       |
| :---- | :---------------------------------: | :-----: | :------------------------------------------------------------------------------------------------ |
| stops | [100, 400, `Dimensions.Height-100`] | `Array` | The snap points at which the modal will come to rest. Recommend at most three, two works as well. |

The main view is a React Native scrollview, so you can customize it using scrollview props (except `style` - I'm working on it!)

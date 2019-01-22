import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 32,
    backgroundColor: "#ffffff"
  },
  topHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  pullButton: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
    opacity: 0.3
  }
});

const PullButton = ({ onPress, topButtonStyle, showTopButton, ...rest }) => {
  return (
    <TouchableOpacity style={styles.topHeader} onPress={onPress} {...rest}>
      {showTopButton && <View style={[styles.pullButton, topButtonStyle]} />}
    </TouchableOpacity>
  );
};

class SwipeUpScrollView extends React.Component {
  state = {
    pan: new Animated.ValueXY({ x: 0, y: 0 }),
    snapIndex: 0,
    initialHeight: 0,
    yOffset: 0
  };

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },

      onPanResponderGrant: (e, gestureState) => {
        this.setState({
          initialHeight: this.state.pan.y._value
        });
      },

      onPanResponderMove: (event, gestureState) => {
        if (this.state.yOffset > 0) {
          this.setState({
            initialHeight: this.state.pan.y._value + gestureState.dy - 1
          });
          return;
        }
        return this.state.pan.setValue({
          x: 0,
          y: Math.min(
            this.props.stops[this.props.stops.length - 1],
            Math.max(
              this.state.initialHeight - gestureState.dy,
              this.props.stops[0]
            )
          )
        });
      },

      onPanResponderRelease: (e, { vx, vy }) => {
        this._snapToNearestStop();
      }
    });

    this.state.pan.y.setValue(this.props.stops[0]);
  }

  _snapToNearestStop = () => {
    let snapIndex = 0;
    const current = this.state.pan.y._value;
    let minDist = Math.abs(this.props.stops[snapIndex] - current);

    this.props.stops.forEach((stopValue, index) => {
      if (Math.abs(current - stopValue) < minDist) {
        minDist = Math.abs(current - stopValue);
        snapIndex = index;
      }
    });

    this._snapToStop(snapIndex);
  };

  _snapToStop = index => {
    if (index > this.props.stops.length - 1) {
      return;
    }

    const snap = this.props.stops[index];
    Animated.spring(this.state.pan.y, {
      toValue: snap,
      easing: Easing.ease,
      speed: 8
    }).start();
    this.setState({
      snapIndex: index
    });
  };

  _onTogglePressed = () => {
    if (this.state.snapIndex === 0) {
      this._snapToStop(this.props.stops.length - 1);
    } else {
      this._snapToStop(0);
    }
  };

  render() {
    const {
      wrapperStyle,
      topCornerRadius,
      showTopButton,
      topButtonStyle,
      stops,
      children,
      ...rest
    } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            height: this.state.pan.y,
            borderTopLeftRadius: topCornerRadius,
            borderTopRightRadius: topCornerRadius
            //        marginLeft: 10,
            //        marginRight: 10
          },
          wrapperStyle
        ]}
      >
        <PullButton
          onPress={this._onTogglePressed}
          showTopButton={showTopButton}
          topButtonStyle={topButtonStyle}
        />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode={"never"}
          scrollEventThrottle={16}
          scrollEnabled={this.state.snapIndex === stops.length - 1}
          onScroll={event => {
            this.setState({
              yOffset: event.nativeEvent.contentOffset.y
            });
          }}
          {...this._panResponder.panHandlers}
          {...rest}
        >
          {children}
        </ScrollView>
      </Animated.View>
    );
  }
}

var { height } = Dimensions.get("window");

SwipeUpScrollView.defaultProps = {
  stops: [100, 400, height - 100],
  topCornerRadius: 20,
  showTopButton: true,
  topButtonStyle: null,
  wrapperStyle: null
};

export default SwipeUpScrollView;

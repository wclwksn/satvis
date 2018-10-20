// Import webpack externals
import Cesium from "Cesium";

export class CesiumEntityWrapper {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = {};
    this.defaultStatus = undefined;
  }

  show(components = this.components) {
    for (var entity of components) {
      this.showComponent(entity);
    }
  }

  hide(components = this.components) {
    for (var entity of components) {
      this.hideComponent(entity);
    }
  }

  get components() {
    return Object.keys(this.entities);
  }

  showComponent(name) {
    if (typeof name === "undefined") {
      return;
    }
    if (name in this.entities && ! this.viewer.entities.contains(this.entities[name])) {
      this.viewer.entities.add(this.entities[name]);
    }
  }

  hideComponent(name) {
    if (typeof name === "undefined") {
      return;
    }
    if (name in this.entities && this.viewer.entities.contains(this.entities[name])) {
      this.viewer.entities.remove(this.entities[name]);
    }
  }

  get isSelected() {
    return this.viewer.selectedEntity === this.defaultEntity;
  }

  get isTracked() {
    return this.viewer.trackedEntity === this.defaultEntity;
  }

  track(animate = false) {
    if (typeof this.defaultEntity === "undefined") {
      return;
    }
    if (!animate) {
      this.viewer.trackedEntity = this.defaultEntity;
      return;
    }

    this.viewer.trackedEntity = undefined;
    const clockRunning = this.viewer.clock.shouldAnimate;
    this.viewer.clock.shouldAnimate = false;

    this.viewer.flyTo(this.defaultEntity, {
      offset: new Cesium.HeadingPitchRange(0, -Cesium.Math.PI_OVER_FOUR, 1580000)
    }).then((result) => {
      if (result) {
        this.viewer.trackedEntity = this.defaultEntity;
        this.viewer.clock.shouldAnimate = clockRunning;
      }
    });
  }

  setSelectedOnTickCallback(onTickCallback = ()=>{}, onUnselectCallback = ()=>{}) {
    const onTickEventRemovalCallback = this.viewer.clock.onTick.addEventListener((clock) => {
      onTickCallback(clock);
    });
    const onSelectedEntityChangedRemovalCallback = this.viewer.selectedEntityChanged.addEventListener(() => {
      onTickEventRemovalCallback();
      onSelectedEntityChangedRemovalCallback();
      onUnselectCallback();
    });
  }

  setTrackedOnTickCallback(onTickCallback = ()=>{}, onUntrackCallback = ()=>{}) {
    const onTickEventRemovalCallback = this.viewer.clock.onTick.addEventListener((clock) => {
      onTickCallback(clock);
    });
    const onTrackedEntityChangedRemovalCallback = this.viewer.trackedEntityChanged.addEventListener(() => {
      onTickEventRemovalCallback();
      onTrackedEntityChangedRemovalCallback();
      onUntrackCallback();
    });
  }

  artificiallyTrack(onTickCallback = ()=>{}, onUntrackCallback = ()=>{}) {
    const cameraTracker = new Cesium.EntityView(this.defaultEntity, this.viewer.scene, this.viewer.scene.globe.ellipsoid);
    this.setTrackedOnTickCallback((clock) => {
      cameraTracker.update(clock.currentTime);
      onTickCallback();
    }, () => {
      onUntrackCallback();
      // Restore default view angle if no new entity is tracked
      if (typeof this.viewer.trackedEntity === "undefined") {
        this.viewer.flyTo(this.defaultEntity, {
          offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90.0), 1580000)
        });
      }
    });
  }

  createCesiumEntity(entityName, entityKey, entityValue, name, description, position, moving) {
    const entity = new Cesium.Entity({
      name: name,
      description: description,
      position: position,
      viewFrom: new Cesium.Cartesian3(0, -1200000, 1150000),
    });

    if (moving) {
      entity.orientation = new Cesium.VelocityOrientationProperty(position);
    }

    entity[entityKey] = entityValue;
    this.entities[entityName] = entity;
  }
}

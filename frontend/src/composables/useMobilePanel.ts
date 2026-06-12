import { onMounted, onUnmounted, ref, type Ref } from "vue";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function useMobilePanel(panelRef: Ref<HTMLElement | null>) {
  const rootStyle = document.documentElement.style;
  const mobileQuery = window.matchMedia("(max-width: 900px)");
  const isDragging = ref(false);
  let mobilePanelOffset = 0;
  let mobilePanelMaxOffset = 0;
  let dragStartY = 0;
  let dragStartOffset = 0;

  function setOffset(offset: number) {
    mobilePanelOffset = clamp(offset, 0, mobilePanelMaxOffset);
    rootStyle.setProperty("--mobile-panel-offset", `${mobilePanelOffset}px`);
  }

  function syncMetrics() {
    const panel = panelRef.value;

    if (!panel || !mobileQuery.matches) {
      rootStyle.setProperty("--mobile-panel-height", "0px");
      rootStyle.setProperty("--mobile-panel-offset", "0px");
      return;
    }

    const height = panel.getBoundingClientRect().height;
    mobilePanelMaxOffset = Math.max(0, height - 86);
    rootStyle.setProperty("--mobile-panel-height", `${height}px`);
    setOffset(Math.min(mobilePanelOffset, mobilePanelMaxOffset));
  }

  function startDrag(event: PointerEvent) {
    if (!panelRef.value || !mobileQuery.matches) {
      return;
    }

    syncMetrics();
    isDragging.value = true;
    dragStartY = event.clientY;
    dragStartOffset = mobilePanelOffset;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function updateDrag(event: PointerEvent) {
    if (!isDragging.value) {
      return;
    }

    setOffset(dragStartOffset + event.clientY - dragStartY);
  }

  function stopDrag() {
    if (!isDragging.value) {
      return;
    }

    isDragging.value = false;
    setOffset(mobilePanelOffset > mobilePanelMaxOffset * 0.4 ? mobilePanelMaxOffset : 0);
  }

  onMounted(() => {
    syncMetrics();
    window.addEventListener("resize", syncMetrics);
    window.addEventListener("pointerup", stopDrag);
    mobileQuery.addEventListener("change", syncMetrics);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", syncMetrics);
    window.removeEventListener("pointerup", stopDrag);
    mobileQuery.removeEventListener("change", syncMetrics);
  });

  return { isDragging, startDrag, updateDrag, stopDrag };
}

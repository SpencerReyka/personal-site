// The stream order, drawn rather than spelled.
//
// Six bars on a shared baseline: green tall and bright, blue short and dim. The point is that
// `gggbbb` reads as a falling staircase you can spot across twenty rows without parsing letters,
// and that height carries the meaning — so the shape survives colour blindness and a washed-out
// phone screen, with hue only reinforcing it.
//
// The bars are aria-hidden and paired with a text equivalent, because "green green green blue
// blue blue" is what a screen reader needs and a row of decorative <i> elements is not.
export function StreamOrder({ order, inline = false }: { order: string; inline?: boolean }) {
  return (
    <>
      <span className={inline ? 'osrs-order osrs-order-inline' : 'osrs-order'} aria-hidden="true">
        {[...order].map((c, i) => (
          <i key={i} className={c === 'g' ? 'g' : 'b'} />
        ))}
      </span>
      <span className="osrs-sr">{[...order].map((c) => (c === 'g' ? 'green' : 'blue')).join(' ')}</span>
    </>
  )
}

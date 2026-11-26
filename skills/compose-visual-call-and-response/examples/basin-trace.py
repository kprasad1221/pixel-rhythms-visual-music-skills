"""A scored water basin and five fixed lamps. Run with Python 3."""

from typing import NamedTuple


class Note(NamedTuple):
    id: str
    tick: int
    strength: float


TICKS_PER_SECOND = 600
SCORE = (Note("D3", 0, 1.0), Note("A3", 225, 0.5), Note("F3", 675, 0.8))
RADIAL_INTERVALS = 120
LAMPS = ("9:00", "10:30", "12:00", "1:30", "3:00")
# The note object carries the strength and identity through the delay.
ANSWERS = tuple((note, note.tick + 150) for note in SCORE)


def pulse(age, rise, fall):
    if age < 0 or age >= rise + fall:
        return 0.0
    if age < rise:
        return age / rise
    return (rise + fall - age) / fall


def sample(tick, withheld=None):
    # In normalized basin units the wave travels one radius per second.
    water = tuple(
        sum(note.strength * pulse(tick - note.tick - index * 5, 30, 90) for note in SCORE)
        for index in range(RADIAL_INTERVALS + 1)
    )
    lights = tuple(
        sum(0.7 * parent.strength * pulse(tick - start - index * 60, 30, 60)
            for parent, start in ANSWERS if parent.id != withheld)
        for index in range(len(LAMPS))
    )
    return water, lights


def crests(water):
    padded = (0.0,) + water + (0.0,)
    return [i / RADIAL_INTERVALS for i, value in enumerate(water)
            if value > padded[i] and value > padded[i + 2]]


def run():
    for tick in (30, 180, 300, 405, 525, 855, 975, 1500):
        water, lights = sample(tick)
        water_gap, lights_gap = sample(tick, withheld="A3")
        assert water == water_gap
        print(f"t={tick / TICKS_PER_SECOND:.3f}s  center={water[0]:.2f}  radii={crests(water)}  "
              f"noon lamp all={lights[2]:.2f} omit-A3={lights_gap[2]:.2f}")

    brightest = []
    for tick in range(180, 421, 60):
        _, lights = sample(tick)
        brightest.append(LAMPS[lights.index(max(lights))])
    print("brightest lamp at 0.30, 0.40, 0.50, 0.60, 0.70 s:", ", ".join(brightest))

    slow = [sample(tick) for tick in range(0, 1501, 20)]  # 30 fps
    fast = [sample(tick) for tick in range(0, 1501, 5)]   # 120 fps
    assert slow == fast[::4]
    assert all(sample(tick, "A3")[0] == frame[0] for tick, frame in zip(range(0, 1501, 5), fast))
    assert not any(fast[-1][0] + fast[-1][1])
    for tick in (405, 855):
        inner, outer = crests(sample(tick)[0])
        print(f"ring spacing at {tick / TICKS_PER_SECOND:.3f}s = {outer - inner:.3f} basin radii")
    print(f"{len(slow)} shared frames identical at 30 and 120 fps; "
          f"water identical across reply modes on {len(fast)} frames; all quiet at 2.50 s")


if __name__ == "__main__":
    run()

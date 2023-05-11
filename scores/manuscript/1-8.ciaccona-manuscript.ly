\version "2.22.1"

voiceFive = #(context-spec-music (make-voice-props-set 4) 'Voice)
voiceSeven = #(context-spec-music (make-voice-props-set 6) 'Voice)

\score {
  \fixed c'
  \new Staff {
    \time 3/4
    \key d \minor
    \partial 2
    <<
      \new Voice = "1" { \voiceOne    { s2     | e'4  e'4. e'8 | f'4 d'4. c'8 | bes4  a4  g16 f _(e f ) | g e _(f d)      } }
      \new Voice = "2" { \voiceThree  { a4. a8 | bes4 a2       | a4  s2       | s2.                     | s4              } }
      \new Voice = "3" { \voiceFive   { f2     | g4   g2       | f4  f2       | g4    f4  s4            | s4              } }
      \new Voice = "4" { \voiceSeven  { d2     | d4   cis2     | d4  bes,2    | g,4   a,4 cis4          | \voiceTwo d8 s8 } }
    >>
    <<
      \new Voice = "1" { \voiceOne    { s2     | e'4  e'4. e'8 | f'4 d'4. d'8 | bes'4 a'8.    g'32 f' g'8. e'16 | f'8. } }
      \new Voice = "2" { \voiceThree  { a4. a8 | bes4 a2       | a4  s2       | d'4   cis'8.  s16     s4        | d'8. } }
      \new Voice = "3" { \voiceFive   { f2     | g4   g2       | f4  f2       | e4    e8.     s16     s4        | s8.  } }
      \new Voice = "4" { \voiceSeven  { d2     | d4   cis2     | d4  bes,2    | g,4   a,8.    s16     s4        | d8.  } }
    >>
  }
  \layout {
    indent = #0
    \context {
      \Score
      barNumberVisibility = #(modulo-bar-number-visible 4 1)
      currentBarNumber = #2
      \override BarNumber.break-visibility = ##(#f #t #t)
    }
  }
  \midi {
    \tempo 4 = 56
  }
}

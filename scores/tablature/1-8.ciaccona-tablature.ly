\version "2.22.1"
% original here: https://lilypond.org/doc/v2.21/Documentation/snippets/simultaneous-notes.it.html
voiceFive = #(context-spec-music (make-voice-props-set 4) 'Voice)

\score {
  \fixed c' {
    \time 3/4
    \key d \minor
    \partial 2
    <<
      \new Voice  {
        \voiceOne
        a4. a8 |
        e'4 e'4. e'8 |
        f'4 d'4. c'8 |
        bes4 a g16 f (e f) |
        g e (f d)
        %
        a4. a8 | 
        e'4 e'4. e'8 |\break
        f'4 d'4. d'8 | 
        bes'4 a'8. g'32 f' g'8. e'16 |
        f'8.
      }
      \new Voice {
        \voiceTwo
        d2 |
        d4 cis2 |
        d4 bes,2 |
        g,4 a, cis |
        d8 s
        %
        d2 |
        d4 cis2 |
        d4 bes,2 |
        g,4 a,8. s16 s4 |
        d8.
      }
      \new Voice {
        \voiceThree
        f2 |
        bes4 a2 |
        a4 s2 |
        g4 f s |
        s4
        %
        f2 |
        bes4 a2 |
        a4 s2 |
        d'4 cis'8. s16 s4 |
        d'8.
      }
      \new Voice {
        \voiceFive
        s2 |
        g4 g2 |
        f4 f2 |
        s4
        %
        s2 |
        s2. |
        g4 g2 |
        f4 f2 |
        e4 e8.
        %
      }
    >>

  }
  \layout {
    indent = #0

    ragged-last = ##t
 \context {
      \Score
      currentBarNumber = #2
    } }
  \midi {}
}
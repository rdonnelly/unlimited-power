import { A } from '@expo/html-elements';
import { memo, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import RenderHtml, { type MixedStyleRecord } from 'react-native-render-html';
import { getRulesClarifications } from 'src/utils/CardUtils';

import type { CardAttributes } from '@data/Card';
import { useTheme } from '@hooks/useTheme';
import { colors } from '@styles/colors';

type CardDetailRulesClarificationsProps = {
  cardAttributes: CardAttributes;
};

function CardDetailRulesClarifications({
  cardAttributes,
}: CardDetailRulesClarificationsProps) {
  const { theme, themeStyles } = useTheme();
  const { width: windowWidth } = useWindowDimensions();

  const deployRulesClarifications = getRulesClarifications(
    cardAttributes.deployBoxStyled,
  );
  const epicActionRulesClarifications = getRulesClarifications(
    cardAttributes.epicActionStyled,
  );
  const textRulesClarifications = getRulesClarifications(
    cardAttributes.textStyled,
  );

  const tagsStyles = useMemo(() => {
    return {
      body: {
        color: theme.text,
        paddingTop: 16,
      },
      p: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 16,
        padding: 0,
      },
      ul: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
      },
      li: {
        marginTop: 0,
        marginHorizontal: 0,
        marginBottom: 16,
        padding: 0,
      },
    } satisfies MixedStyleRecord;
  }, [theme]);

  if (
    !deployRulesClarifications &&
    !epicActionRulesClarifications &&
    !textRulesClarifications
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inner,
          {
            backgroundColor:
              theme.scheme === 'light' ? colors.orange100 : colors.amber950,
            borderColor:
              theme.scheme === 'light' ? colors.yellow500 : colors.amber800,
          },
        ]}
      >
        {deployRulesClarifications ? (
          <RenderHtml
            contentWidth={windowWidth - 32}
            source={{ html: deployRulesClarifications }}
            tagsStyles={tagsStyles}
          />
        ) : null}
        {epicActionRulesClarifications ? (
          <RenderHtml
            contentWidth={windowWidth - 32}
            source={{ html: epicActionRulesClarifications }}
            tagsStyles={tagsStyles}
          />
        ) : null}
        {textRulesClarifications ? (
          <RenderHtml
            contentWidth={windowWidth - 32}
            source={{ html: textRulesClarifications }}
            tagsStyles={tagsStyles}
          />
        ) : null}
        <View style={styles.credit}>
          <A
            href={`https://starwarsunlimited.com/cards?cid=${cardAttributes.cardUid}`}
            style={[styles.creditText, themeStyles.colorSubdued]}
          >
            Source: starwarsunlimited.com
          </A>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  inner: {
    alignItems: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  credit: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  creditText: {
    fontStyle: 'italic',
  },
});

const memoCardDetailRulesClarifications =
  memo<CardDetailRulesClarificationsProps>(CardDetailRulesClarifications);
export { memoCardDetailRulesClarifications as CardDetailRulesClarifications };

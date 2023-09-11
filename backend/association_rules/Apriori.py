import pandas as pd
import numpy as np
from apyori import apriori
from core.crud.standard import Crud
from .SemanticSimilarity import SemanticSimilarity

from .models import AssociationRule, BaseGroup, ResultGroup
from .serializers import AssociationRuleSerializer, BaseGroupSerializer, ResultGroupSerializer


class Apriori:
    crudAssociationRule = Crud(AssociationRuleSerializer, AssociationRule)
    crudBaseGroup = Crud(BaseGroupSerializer, BaseGroup)
    crudResultGroup = Crud(ResultGroupSerializer, ResultGroup)
    similarity = SemanticSimilarity()

    def recommended(self, key):
        arrRules = AssociationRule.objects.all().values_list(
            'base_group_id', 'result_group_id')
        [arrBaseGroups, sentenceBaseGroups,
            numberBaseGroups] = self.formatBaseGroups()
        [arrResultGroups, sentenceResultGroups,
            numberResultGroups] = self.formatResultGroups()
        arrResultGroups = np.array(arrResultGroups)

        recommendations = []

        self.similarity.load_nlp()

        if (len(arrRules) > 0):
            # Apply association rules
            rules = apriori(arrRules, min_support=0.002,
                            min_confidence=0.3, min_lift=1.0001, min_length=2)
            results = list(rules)
            results = pd.DataFrame(results)

            group = self.searchGroup(arrBaseGroups, key, sentenceBaseGroups)

            if (group[0] == -1 or group[0] == -2):
                for i in range(len(results.index)):
                    for j in range(len(list(results.iloc[i, 2]))):
                        if (len(list(list(results.iloc[i, 2][j][0]))) > 0 and list(list(results.iloc[i, 2][j][0]))[0] == group[1]):
                            index = np.where(arrResultGroups == list(
                                list(results.iloc[i, 2][j][1]))[0])[0][0]
                            if (key != arrResultGroups[index][1]):
                                recommendations.append({
                                    'sentence': arrResultGroups[index][1].capitalize(),
                                    'confidence': results.iloc[i, 2][j][2]
                                })
                        else:
                            pass

                recommendations.sort(key=lambda x: x.get(
                    'confidence'), reverse=True)

        self.similarity.unload_nlp()

        return recommendations[:20]

    def add(self, request):
        [arrBaseGroups, sentenceBaseGroups,
            numberBaseGroups] = self.formatBaseGroups()
        [arrResultGroups, sentenceResultGroups,
            numberResultGroups] = self.formatResultGroups()
        newRules = request.data['rules']

        self.similarity.load_nlp()

        for rule in newRules:
            # Create new base groups and change key per base group
            group = self.searchGroup(
                arrBaseGroups, rule[0], sentenceBaseGroups)
            if (group[0] == -3):  # No similar user stories exist
                nextGroupNumber = max(numberBaseGroups) + 1 \
                    if (len(numberBaseGroups) > 0) else 1

                newBaseGroup = [['B-' + str(nextGroupNumber), rule[0]]]
                arrBaseGroups.extend(newBaseGroup)
                sentenceBaseGroups.extend([rule[0]])
                numberBaseGroups.extend([nextGroupNumber])

                self.crudBaseGroup.create({
                    'group_id': newBaseGroup[0][0],
                    'sentence': newBaseGroup[0][1]
                })

                rule[0] = str('B-' + str(nextGroupNumber))
            elif (group[0] == -1):  # This user story does not exactly exist

                newBaseGroup = [[group[1], rule[0]]]
                arrBaseGroups.extend(newBaseGroup)
                sentenceBaseGroups.extend([rule[0]])

                self.crudBaseGroup.create({
                    'group_id': newBaseGroup[0][0],
                    'sentence': newBaseGroup[0][1]
                })

                rule[0] = str(group[1])
            elif (group[0] == -2):  # This user story already exists exactly
                rule[0] = str(group[1])

            # Create new result groups and change key per result group
            group = self.searchGroup(
                arrResultGroups, rule[1], sentenceResultGroups)
            if (group[0] == -3):  # No similar user stories exist
                nextGroupNumber = max(numberResultGroups) + 1 \
                    if (len(numberResultGroups) > 0) else 1

                newResultGroup = [['R-' + str(nextGroupNumber), rule[1]]]
                arrResultGroups.extend(newResultGroup)
                sentenceResultGroups.extend([rule[1]])
                numberResultGroups.extend([nextGroupNumber])

                self.crudResultGroup.create({
                    'group_id': newResultGroup[0][0],
                    'sentence': newResultGroup[0][1]
                })

                rule[1] = str('R-' + str(nextGroupNumber))
            elif (group[0] == -1):  # This user story does not exactly exist
                newResultGroup = [[group[1], rule[1]]]
                arrResultGroups.extend(newResultGroup)
                sentenceResultGroups.extend([rule[1]])

                self.crudResultGroup.create({
                    'group_id': newResultGroup[0][0],
                    'sentence': newResultGroup[0][1]
                })

                rule[1] = str(group[1])
            elif (group[0] == -2):  # This user story already exists exactly
                rule[1] = str(group[1])

            self.crudAssociationRule.create({
                'base_group_id': rule[0],
                'result_group_id': rule[1]
            })

        self.similarity.unload_nlp()

        return True

    def assignGroup(self, groups, element):
        return self.searchGroup(groups, element[0])

    def searchGroup(self, groups, key, sentenceGroups):
        if (len(sentenceGroups) > 0):
            similaries = self.similarity.getSimilarity(
                key, sentenceGroups, 0.90)  # Percentage of similarity tolerance
            if(len(similaries) > 0):
                index = sentenceGroups.index(similaries[1])
                if (similaries[0] < 1):  # This user story does not exactly exist
                    return [-1, str(groups[index][0])]
                else:  # This user story already exists exactly
                    return [-2, str(groups[index][0])]

        return [-3]  # No similar user stories exist

    def formatBaseGroups(self):
        try:
            arrBaseGroups = BaseGroup.objects.all().values_list(
                'group_id', 'sentence')
            sentenceBaseGroups = []
            numberBaseGroups = []

            for i in range(0, len(arrBaseGroups)):
                sentenceBaseGroups.append(arrBaseGroups[i][1])
                numberBaseGroups.append(int(arrBaseGroups[i][0].split('-')[1]))

            return [list(arrBaseGroups), sentenceBaseGroups, numberBaseGroups]
        except:
            return [[], [], []]

    def formatResultGroups(self):
        try:
            arrResultGroups = ResultGroup.objects.all().values_list(
                'group_id', 'sentence')
            sentenceResultGroups = []
            numberResultGroups = []

            for i in range(0, len(arrResultGroups)):
                sentenceResultGroups.append(arrResultGroups[i][1])
                numberResultGroups.append(
                    int(arrResultGroups[i][0].split('-')[1]))

            return [list(arrResultGroups), sentenceResultGroups, numberResultGroups]
        except:
            return [[], [], []]

import React, { useEffect} from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
function DocumentPdf(props) {
    // console.log(props.userStories)
    const styles = StyleSheet.create({
        title: {
            fontSize: 20,
            paddingTop: 10,
            paddingBottom: 20,
            textAlign: "center"
        },
        table: {
            width: '100%',
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #000',
            paddingTop: 8,
            paddingLeft:5,
            paddingBottom: 8,
            fontSize: 12
        },
        header: {
            borderTop: 'none',
            backgroundColor: '#053552',
            fontSize: 12,
            color: "white"
        },
        bold: {
            fontWeight: 'bold',
        },
        // So Declarative and unDRY 👌
        row1: {
            width: '10%',
        },
        row2: {
            width: '27%',
        },
        row3: {
            width: '20%',
            textAlign: "center"
        },
        row4: {
            width: '30%',
        },
        row5: {
            width: '10%',
            textAlign: "center"
        },
        row6: {
            width: '10%',
        },
        row7: {
            width: '27%',
        },
    })
    useEffect(() => {

    }, [])
    return (
        <Document>
            <Page>
                <View style={[styles.title, styles.bold]}>
                    <Text>PRODUCT BACKLOG</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.row, styles.bold, styles.header]}>
                        <Text style={styles.row1}>Id</Text>
                        <Text style={styles.row2}>Name</Text>
                        <Text style={styles.row3}>Actor</Text>
                        <Text style={styles.row4}>Description</Text>
                        <Text style={styles.row5}>Points</Text>
                        <Text style={styles.row6}>Priority</Text>
                        <Text style={styles.row7}>Dependencies</Text>
                    </View>
                    {props.userStories.map((row, i) => (
                        <View key={i} style={styles.row} wrap={false}>
                            <Text style={styles.row1}>{row.id}</Text>
                            <Text style={styles.row2}>{row.name}</Text>
                            <Text style={styles.row3}>{row.actor}</Text>
                            <Text style={styles.row4}>As a {row.actor.toLowerCase()}, I want to {row.name.toLowerCase()} {row.purpose !== '' ? `to ${row.purpose.toLowerCase()}` : ''}</Text>
                            <Text style={styles.row5}>{row.points}</Text>
                            <Text style={styles.row6}>{row.priority}</Text>
                            <Text style={styles.row7}>{row.dependencies}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    )
}



export default DocumentPdf;
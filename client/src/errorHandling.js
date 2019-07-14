const handleErrors = (res) => {
    if (res.status !== 200) {
        return res.text().then(err => {
            throw err
        })
    }

    return res
}

export default handleErrors